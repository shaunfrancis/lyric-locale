export const dynamic = "force-dynamic";

import { sql } from '@vercel/postgres';
import { Client, Song as GeniusSong } from 'genius-lyrics';
import explicitText from '@/lib/explicitText';
import clean from '@/lib/clean';

export async function GET(request: Request) : Promise<Response> {

    const song = {id: -1, title: ""};

    const rejectSong = async ( song : {id : number, title : string}, reason : number) => {
        await sql`UPDATE songs SET status = ${reason} WHERE id = ${song.id}`;
        return Response.json( {status : 400, error : reason, title: song.title } );
    };

    try{
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

        if( explicitText(lyrics) ) return rejectSong(song, 4);

        return Response.json( { status : 200, lyrics: lyrics } );
    }
    catch(err){ return Response.json( {status : 500, error : err} ) }
}