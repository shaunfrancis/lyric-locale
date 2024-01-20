import { Languages } from '@/constants/Languages';
import DiscogsSong from '@/types/Song';
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Client, Song as GeniusSong } from 'genius-lyrics';
import { v2 as GoogleTranslate } from '@google-cloud/translate';
import Language from '@/types/Language';

export async function GET(request: Request) : Promise<Response> {
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const rejectSong = async ( song : {id : number, title : string}, reason : number) => {
        await connection.execute( 'UPDATE unnamed_song_game_songs SET status = ? WHERE id = ?', [reason, song.id] );
        return Response.json( {status : 400, error : reason, title: song.title } );
    };

    try{
        //choose a song from table
        const [chooseSong] = await connection.query<RowDataPacket[]>( 'SELECT id, title FROM unnamed_song_game_songs WHERE id=94 AND status = 0 ORDER BY RAND() LIMIT 1' );
        const song = chooseSong[0] as {id : number, title : string};

        //check that song exists on user search API (Discogs)
        const discogsCheckRequest = await fetch(process.env.TRACK_SEARCH_URL + "&type=master&format=single&per_page=5&q=" + song.title, {
            headers: { "User-Agent": "unnamedSongGame/0.0 +https://tennessine.co.uk" }
        });
        const discogsCheck = await discogsCheckRequest.json() as {results : DiscogsSong[]};
        discogsCheck.results.forEach( s => s.title = s.title.replace(/\([0-9]*\) - /g, "- ") );

        let fail = false;
        if(discogsCheck.results.length == 0) fail = true; //no results
        else if(discogsCheck.results[0].title.toLowerCase() != song.title.toLowerCase()) fail = true; //title of first result is not identical to chosen song title
        else if(discogsCheck.results.find( s => s.title.toLowerCase() == song.title.toLowerCase() && s != discogsCheck.results[0])) fail = true; //duplicate results

        const discogsSong = discogsCheck.results[0];
        if(fail) return rejectSong(song, 1);


        //check that song exists on backend lyrics API (Genius)
        const GeniusClient = new Client();
        const geniusCheck = await GeniusClient.songs.search(song.title);
        
        const compatibleTitles = geniusCheck.map( s => {
            const fragments = s.fullTitle.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").replace(/’/g,"'").split(" by ");
            let title;
            if(fragments.length != 2) title = "";
            else title = fragments[1] + " - " + fragments[0];

            return {song: s, compatibleTitle: title}
        });

        const compatibleTitleResult = compatibleTitles.find( s => s.compatibleTitle.toLowerCase() == song.title.toLowerCase() );
        if(!compatibleTitleResult) return rejectSong(song, 2);

        const geniusSong = compatibleTitleResult.song;

        //download song lyrics
        let fullLyrics = await geniusSong.lyrics();
        fullLyrics = fullLyrics.replace(/\[.*\]\n/g, "");
        
        const verses = fullLyrics.split("\n\n");
        
        let lyrics = verses[0];
        let lines = (lyrics.match(/\n/g) || []).length;
        let count = 1;
        do{
            const verse = verses[count];
            const length = (verse.match(/\n/g) || []).length;
            if(lines + length <= 8 || lines == 0){
                lyrics += "\n" + verse;
                lines += length;
                count++;
            }
            else lines = 8;
        } while (lines < 8) ;


        //translate song lyrics
        //const translate = new GoogleTranslate.Translate();

        const langs : Language[] = Languages.sort(() => Math.random() - Math.random()).slice(0, 6);
        const clues : any[] = [];
        let incorrectSourceLanguage = false;
        langs.forEach( (language, index) => {
            if(incorrectSourceLanguage) return;
            //const translatedLyrics = await translate.translate(lyrics, language.code);
            //if(translatedLyrics[1].data.translations[0].detectedSourceLanguage != "en") incorrectSourceLanguage = true;
            
            const translatedLyrics = "Translated lyrics here";

            const clue = [index+1, language.code, translatedLyrics];
            clues.push(clue);

        });
        if(incorrectSourceLanguage) return rejectSong(song, 3);
        
        //create game
        const createGameSql = 'INSERT INTO unnamed_song_game_games (song_id, solution_id, lyrics, thumb) VALUES (?,?,?,?)';
        const [createGameResult] = await connection.execute( createGameSql, [song.id, discogsSong.id, lyrics, discogsSong.thumb] );

        const game_id = (createGameResult as ResultSetHeader).insertId;

        const createCluesSql = 'INSERT INTO unnamed_song_game_clues (game_id, level, language, lyrics) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?)';
        await connection.execute( createCluesSql, clues.map( clue => { return [game_id, ...clue] } ).flat(1) );

        await connection.execute( 'UPDATE unnamed_song_game_songs SET status = ? WHERE id = ?', [9, song.id] );
        return Response.json( { status : 200, title: song.title } );

    }
    catch(err){ return Response.json( {status : 500, error : err} ) }
}