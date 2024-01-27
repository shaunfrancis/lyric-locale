export const dynamic = "force-dynamic";

import { sql } from '@vercel/postgres';
import { v2 as GoogleTranslate } from '@google-cloud/translate';
import Language from '@/types/Language';
import { Languages } from '@/constants/Languages';

export async function GET(request: Request) : Promise<Response> {
    
    const song = {id: -1, title: ""};

    const rejectSong = async ( song : {id : number, title : string}, reason : number) => {
        await sql`UPDATE songs SET status = ${reason} WHERE id = ${song.id}`;
        return Response.json( {status : 400, error : reason, title: song.title } );
    };

    try{
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
        return Response.json( { status : 200, clues: clues } );
    }
    catch(err){ return Response.json( {status : 500, error : err} ) }
}