export const dynamic = "force-dynamic";

import { sql } from '@vercel/postgres';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) : Promise<Response> {

    const { id, elapsed, score } = await request.json();
    if(!id || (!score && score !== 0) || typeof id !== "number" || typeof score !== "number" || score < -1 || score > 5){
        return Response.json({error: "MISSING PARAMS"}, {status: 400});
    }

    try{
        let dbResponse = await fetch(process.env.TS_API_URL + `/scores.php?id=${id}&score=${score}&elapsed=${elapsed}`);
        if(dbResponse.status == 200) return Response.json( {}, {status: 200} );
        else return Response.json({error: dbResponse.status}, {status: dbResponse.status});

    }
    catch(error){
        return Response.json({error: error}, {status: 500});
    }

}