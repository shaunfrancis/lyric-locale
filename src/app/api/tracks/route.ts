export const dynamic = "force-dynamic";

import Song from '@/types/Song';
import { NextRequest } from 'next/server';

let ratelimit_remaining = Infinity;

export async function GET(request: NextRequest) : Promise<Response> {
    if(ratelimit_remaining <= 5) return Response.json([]);
    
    const clean = (title : string) : string => {
        //weird spaces and apstrophes
        title = title.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").replace(/’/g,"'");

        //asterisks after artists
        title = title.replace(/\* - /g, " - ");

        //bracketed numbers after artists
        title = title.replace(/\([0-9]*\) - /g, "- ");

        return title;
    }

    let query = request.nextUrl.searchParams.get("query");
    if(!query) return Response.json([]);
    query = query.replace(/ /g, '+');

    const res = await fetch(process.env.TRACK_SEARCH_URL + "&type=master&format=single&per_page=5&q=" + query, {
        headers: { "User-Agent": "lyricLocale/1.0 +https://lyriclocale.tennessine.co.uk" }
    });

    ratelimit_remaining = res.headers.get('x-discogs-ratelimit-remaining') ? parseInt(res.headers.get('x-discogs-ratelimit-remaining')!) : Infinity;

    const product = await res.json() as {results : Song[]};

    const results : Song[] = [];
    product.results.forEach( result => {
        results.push({
            id: result.id,
            title: clean(result.title),
            thumb: result.thumb
        });
    });

    return Response.json( results );
}