export const dynamic = "force-dynamic";

import { sql } from '@vercel/postgres';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) : Promise<Response> {

    const { id, score } = await request.json();
    if(!id || (!score && score !== 0) || typeof id !== "number" || typeof score !== "number" || score < -1 || score > 5){
        return Response.json({error: "MISSING PARAMS"}, {status: 400});
    }

    try{
        await sql`INSERT INTO scores (game_id, score) VALUES (${id}, ${score})`;
        return Response.json( {}, {status: 200} );
    }
    catch(error){
        return Response.json({error: error}, {status: 500});
    }

}