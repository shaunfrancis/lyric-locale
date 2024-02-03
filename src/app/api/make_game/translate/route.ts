export const dynamic = "force-dynamic";

import { v2 as GoogleTranslate } from '@google-cloud/translate';
import { WebClient as SlackClient } from '@slack/web-api';
import Language from '@/types/Language';
import { Languages } from '@/constants/Languages';
import { NextRequest, NextResponse } from 'next/server';
import rejectSong from '@/lib/rejectSong';
import authenticate from '@/lib/authenticate';

const shuffle = <T>(arr : Array<T>) : Array<T> => {
    return arr.map( value => { return { value: value, magnitude: Math.random() } } )
        .sort( (a,b) => { return b.magnitude - a.magnitude } )
        .map( data => data.value )
}

let prevFirstClueCode : string; //avoid first clue being same language as yesterday
export async function POST(request: NextRequest) : Promise<NextResponse> {
    if(!authenticate(request)) return NextResponse.json( {error : "UNAUTHORISED"}, {status: 401} );
    
    const {song, lyrics} = await request.json();

    try{
        const slack = new SlackClient(process.env.SLACK_TOKEN);
        await slack.chat.postMessage({ channel: '#lyriclocale', text: 'Translation API called.' });

        const translate = new GoogleTranslate.Translate({key: process.env.GOOGLE_TOKEN});
        const langs : Language[] = shuffle(Languages.filter(l => l.difficulty == 1 && l.code != prevFirstClueCode)).slice(0,1);
        langs.push(...shuffle(Languages.filter(l => !l.difficulty)).slice(0,5));

        prevFirstClueCode = langs[0].code;
        
        const clues : any[] = [];

        for(let index = 0; index < langs.length; index++){
            const translatedLyrics = await translate.translate(lyrics, langs[index].code);

            if(translatedLyrics[1].data.translations[0].detectedSourceLanguage != "en") return rejectSong(song, 3);

            const clue = [index+1, langs[index].code, translatedLyrics[0]];
            clues.push(clue);

        };
        return NextResponse.json( { clues: clues }, {status: 200} );
    }
    catch(err){ return NextResponse.json( {error : err}, {status: 500} ) }
}