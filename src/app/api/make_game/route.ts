export const dynamic = "force-dynamic";

import { Languages } from '@/constants/Languages';
import DiscogsSong from '@/types/Song';
import { sql } from '@vercel/postgres';
import { Client, Song as GeniusSong } from 'genius-lyrics';
import { v2 as GoogleTranslate } from '@google-cloud/translate';
import Language from '@/types/Language';

export async function GET(request: Request) : Promise<Response> {

    const rejectSong = async ( song : {id : number, title : string}, reason : number) => {
        await sql`UPDATE songs SET status = ${reason} WHERE id = ${song.id}`;
        return Response.json( {status : 400, error : reason, title: song.title } );
    };

    const clean = (title : string) : string => {
        //weird spaces and apstrophes
        title = title.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").replace(/’/g,"'");

        //asterisks after artists
        title = title.replace(/\* - /g, " - ");

        //bracketed numbers after artists
        title = title.replace(/\([0-9]*\) - /g, "- ");

        return title.replace(/  +/g, " ").toLowerCase();
    }

    try{
        //choose a song from table
        const { rows : chooseSong } = await sql`SELECT id, title FROM songs WHERE status = 0 ORDER BY RANDOM() LIMIT 1`;
        const song = chooseSong[0] as {id : number, title : string};

        //check that song exists on user search API (Discogs)
        const discogsCheckRequest = await fetch(process.env.TRACK_SEARCH_URL + "&type=master&format=single&per_page=5&q=" + song.title, {
            headers: { "User-Agent": "lyricLocale/1.0 +https://lyriclocale.tennessine.co.uk" }
        });
        const discogsCheck = await discogsCheckRequest.json() as {results : DiscogsSong[]};
        discogsCheck.results.forEach( s => s.title = clean(s.title) );

        let fail = false;
        if(discogsCheck.results.length == 0) fail = true; //no results
        else if(discogsCheck.results[0].title != song.title.toLowerCase()) fail = true; //title of first result is not identical to chosen song title

        const discogsSong = discogsCheck.results[0];
        if(fail) return rejectSong(song, 1);


        //check that song exists on backend lyrics API (Genius)
        const GeniusClient = new Client();
        const geniusCheck = await GeniusClient.songs.search(song.title);
        
        const compatibleTitles = geniusCheck.map( s => {
            const fragments = clean(s.fullTitle).split(" by ");
            let title;
            if(fragments.length != 2) title = "";
            else title = fragments[1] + " - " + fragments[0];

            return {song: s, compatibleTitle: title.replace(/  +/g, " ")}
        });

        const compatibleTitleResult = compatibleTitles.find( s => s.compatibleTitle == song.title.toLowerCase() );
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
        const langs : Language[] = Languages.filter(l => l.difficulty == 1).sort(() => Math.random() - Math.random()).slice(0, 1);
        langs.push(...Languages.filter(l => !l.difficulty).sort(() => Math.random() - Math.random()).slice(0, 5));
        
        const clues : any[] = [];

        for(let index = 0; index < langs.length; index++){
            //const translatedLyrics = await translate.translate(lyrics, langs[index].code);
            const translatedLyrics : [string, {data:{translations:[{detectedSourceLanguage:string}]}}] = ["Translated lyrics", {data:{translations:[{detectedSourceLanguage:"en"}]}}]; //dummy data

            if(translatedLyrics[1].data.translations[0].detectedSourceLanguage != "en") return rejectSong(song, 3);

            const clue = [index+1, langs[index].code, translatedLyrics[0]];
            clues.push(clue);

        };
        
        //create game
        await sql`INSERT INTO games (song_id, solution_id, lyrics, thumb) VALUES (${song.id},${discogsSong.id},${lyrics},${discogsSong.thumb})`;
        
        const { rows: id_check } = await sql`SELECT MAX(id) as max FROM games`;
        const game_id = id_check[0].max;
        
        await sql`INSERT INTO clues (game_id, level, language, lyrics) VALUES
            (${game_id}, ${clues[0][0]}, ${clues[0][1]}, ${clues[0][2]}),
            (${game_id}, ${clues[1][0]}, ${clues[1][1]}, ${clues[1][2]}),
            (${game_id}, ${clues[2][0]}, ${clues[2][1]}, ${clues[2][2]}),
            (${game_id}, ${clues[3][0]}, ${clues[3][1]}, ${clues[3][2]}),
            (${game_id}, ${clues[4][0]}, ${clues[4][1]}, ${clues[4][2]}),
            (${game_id}, ${clues[5][0]}, ${clues[5][1]}, ${clues[5][2]})
        `;

        await sql`UPDATE songs SET status = 9 WHERE id = ${song.id}`;
        return Response.json( { status : 200, title: song.title } );

    }
    catch(err){ return Response.json( {status : 500, error : err} ) }
}