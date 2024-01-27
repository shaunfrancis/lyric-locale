export const dynamic = "force-dynamic";

import { v2 as GoogleTranslate } from '@google-cloud/translate';
import Language from '@/types/Language';
import { Languages } from '@/constants/Languages';
import { NextResponse } from 'next/server';
import rejectSong from '@/lib/rejectSong';

export async function POST(request: Request) : Promise<NextResponse> {
    
    const song = await request.json();

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
        return NextResponse.json( { status : 200, clues: clues } );
    }
    catch(err){ return NextResponse.json( {status : 500, error : err} ) }
}