export const dynamic = "force-dynamic";

import { v2 as GoogleTranslate } from '@google-cloud/translate';
import { WebClient as SlackClient } from '@slack/web-api';
import Language from '@/types/Language';
import { Languages } from '@/constants/Languages';
import { NextRequest, NextResponse } from 'next/server';
import rejectSong from '@/lib/rejectSong';
import authenticate from '@/lib/authenticate';

export async function POST(request: NextRequest) : Promise<NextResponse> {
    if(!authenticate(request)) return NextResponse.json( {error : "UNAUTHORISED"}, {status: 401} );
    
    const {song, lyrics} = await request.json();

    try{
        const slack = new SlackClient(process.env.SLACK_TOKEN);
        await slack.chat.postMessage({ channel: '#lyriclocale', text: 'Translation API called.' });

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
        return NextResponse.json( { clues: clues }, {status: 200} );
    }
    catch(err){ return NextResponse.json( {error : err}, {status: 500} ) }
}