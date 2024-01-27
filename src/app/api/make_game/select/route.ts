export const dynamic = "force-dynamic";

import DiscogsSong from '@/types/Song';
import { sql } from '@vercel/postgres';
import explicitText from '@/lib/explicitText';
import clean from '@/lib/clean';

export async function GET(request: Request) : Promise<Response> {

    const rejectSong = async ( song : {id : number, title : string}, reason : number) => {
        await sql`UPDATE songs SET status = ${reason} WHERE id = ${song.id}`;
        return Response.json( {status : 400, error : reason, title: song.title } );
    };

    try{
        //choose a song from table
        const { rows : chooseSong } = await sql`SELECT id, title FROM songs WHERE status = 0 ORDER BY RANDOM() LIMIT 1`;
        const song = chooseSong[0] as {id : number, title : string};
        if( explicitText(song.title) ) return rejectSong(song, 4);

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

        return Response.json( { status : 200, id: song.id, title: song.title } );

    }
    catch(err){ return Response.json( {status : 500, error : err} ) }
}