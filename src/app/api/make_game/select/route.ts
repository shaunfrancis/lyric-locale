export const dynamic = "force-dynamic";

import DiscogsSong from '@/types/Song';
import { sql } from '@vercel/postgres';
import explicitText from '@/lib/explicitText';
import clean from '@/lib/clean';
import rejectSong from '@/lib/rejectSong';
import { NextResponse } from 'next/server';

export async function GET(request: Request) : Promise<NextResponse> {

    try{
        //choose a song from table
        const { rows : chooseSong } = await sql`SELECT id, title, thumb FROM songs WHERE status = 0 ORDER BY RANDOM() LIMIT 1`;
        const song = chooseSong[0] as {id : number, title : string, thumb : string};
        if( explicitText(song.title) ) return rejectSong(song, 4);

        return NextResponse.json( song, {status: 200} );

    }
    catch(err){ return NextResponse.json( {error : err}, {status: 500} ) }
}