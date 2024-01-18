import SongResult from '@/types/Song';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) : Promise<Response> {
    let query = request.nextUrl.searchParams.get("query");
    if(!query) return Response.json([]);
    query = query.replace(/ /g, '+');

    const res = await fetch(process.env.TRACK_SEARCH_URL + "&type=master&format=single&per_page=5&q=" + query, {
        headers: { "User-Agent": "unnamedSongGame/0.0 +https://tennessine.co.uk" }
    });
    const product = await res.json() as {results : SongResult[]};

    const results : SongResult[] = [];
    product.results.forEach( result => {
        results.push({
            id: result.id,
            title: result.title,
            thumb: result.thumb
        });
    });

    return Response.json( results );
}