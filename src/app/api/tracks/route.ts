export const dynamic = "force-dynamic";

import explicitText from '@/lib/explicitText';
import Song from '@/types/Song';
import { NextRequest } from 'next/server';
const Levenshtein = require('fast-levenshtein');

const clean = (title : string) : string => {
    //weird spaces and apstrophes
    title = title.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").replace(/’/g,"'");

    //asterisks after artists
    title = title.replace(/\* - /g, " - ");

    //bracketed numbers after artists
    title = title.replace(/\([0-9]*\) - /g, "- ");

    return title;
}


let ratelimit_remaining = Infinity;
export async function GET(request: NextRequest) : Promise<Response> {
    let query = request.nextUrl.searchParams.get("query");
    if(!query) return Response.json([]);
    query = query.replace(/ /g, '+');

    let dbResponse = await fetch(process.env.TS_API_URL + "/tracks.php?query=" + query);
    let dbResults : any[] = await dbResponse.json();
    dbResults = dbResults.filter( result => result.likeness > 0.3 );

    let discogsResults : { results : Song[] }
    if(ratelimit_remaining <= 5) discogsResults = {results: []};
    else{
        const discogsResponse = await fetch(process.env.TRACK_SEARCH_URL + "&type=master&format=single&per_page=5&q=" + query, {
            headers: { "User-Agent": "lyricLocale/1.0 +https://lyriclocale.tennessine.co.uk" }
        });
        ratelimit_remaining = discogsResponse.headers.get('x-discogs-ratelimit-remaining') ? parseInt(discogsResponse.headers.get('x-discogs-ratelimit-remaining')!) : Infinity;
        discogsResults = await discogsResponse.json() as {results : Song[]};
        discogsResults.results.forEach( s => { s.id = -1 } );
    }

    const results : any[] = [];
    const compareClean = (value : string) => clean(value).replace(/\./g, '').replace(/'/g,'').toLowerCase();

    [...discogsResults.results, ...dbResults].forEach( result => {
        if(explicitText(result.title)) return;
        if(result.id == -1 && dbResults.some(s => compareClean(s.title) == compareClean(result.title))) return;
        
        results.push({
            id: result.id,
            title: clean(result.title),
            thumb: result.thumb,
            levenshtein: Levenshtein.get(query, clean(result.title))
        });
    });

    results.sort( (a,b) => a.levenshtein! - b.levenshtein! );
    
    return Response.json( results.slice(0,5) );
}