export const dynamic = "force-dynamic";

import explicitText from '@/lib/explicitText';
import rejectSong from '@/lib/rejectSong';
import { NextResponse } from 'next/server';

export async function GET(request: Request) : Promise<NextResponse> {

    try{
        //choose a song from table
        let dbResponse = await fetch(process.env.TS_API_URL + `/make_game/select.php`);
        if(dbResponse.status == 200){
            const songs = await dbResponse.json();
            const song = songs[0] as {id : number, title : string, thumb : string};
            if( explicitText(song.title) ) return rejectSong(song, 4);
            return NextResponse.json( song, {status: 200} );
        }
        else return NextResponse.json({error: dbResponse.status}, {status: dbResponse.status});
    }
    catch(err){ return NextResponse.json( {error : err}, {status: 500} ) }
}