export const dynamic = "force-dynamic";
import { Client, Song as GeniusSong } from 'genius-lyrics';
import explicitText from '@/lib/explicitText';
import clean from '@/lib/clean';
import rejectSong from '@/lib/rejectSong';
import { NextRequest, NextResponse } from 'next/server';
import authenticate from '@/lib/authenticate';

export async function POST(request: NextRequest) : Promise<NextResponse> {

    if(!authenticate(request)) return NextResponse.json( {error : "UNAUTHORISED"}, {status: 401} );

    const song = await request.json();

    try{
        //check that song exists on backend lyrics API (Genius)
        const GeniusClient = new Client();
        const geniusCheck = await GeniusClient.songs.search(song.title);
        
        const compatibleTitles = geniusCheck.map( s => {
            const fragments = clean(s.fullTitle).replace(/\./g, '').replace(/'/g,'').split(" by ");
            let title;
            if(fragments.length != 2) title = "";
            else{
                title = fragments[1].replace(/ \(ft .*\)/g, "") + " - " + fragments[0];
            }

            return {song: s, compatibleTitle: title.replace(/  +/g, " ")}
        });

        const compatibleTitleResult = compatibleTitles.find( s => s.compatibleTitle == song.title.replace(/\./g, '').replace(/'/g,'').toLowerCase() );
        
        
        if(!compatibleTitleResult) return rejectSong(song, 2);

        const geniusSong = compatibleTitleResult.song;

        //download song lyrics
        let fullLyrics = await geniusSong.lyrics();
        fullLyrics = fullLyrics.replace(/\[.*\]\n/g, ""); //remove [Verse/Chorus] labels
        
        const verses = fullLyrics.split("\n\n");
        
        //want more than 4 lines, max of 10, empty lines not included
        let lyrics = "", lines = 0, verseCount = 0;
        while(lines <= 4){
            const verse = verses[verseCount].split("\n");
            
            if(verseCount != 0) lyrics += "\n";
            for(let line = 0; line < verse.length; line++){
                if(lines >= 10) break;
                if(verse[line].trim() == "") continue;

                if(lines != 0) lyrics += "\n";
                lyrics += verse[line];
                lines++;
            }

            verseCount++;
        }

        if( explicitText(lyrics) ) return rejectSong(song, 4);

        return NextResponse.json( { lyrics: lyrics }, {status: 200} );
    }
    catch(err){ return NextResponse.json( {error : err}, {status: 500} ) }
}