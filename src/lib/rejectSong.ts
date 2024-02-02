import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

/* Fail reason codes
    2: Genius API
    3: Non-English lyrics
    4: Explicit title or lyrics
*/

export default async function rejectSong( song : {id : number, title : string}, reason : number) : Promise<NextResponse> {
    await sql`UPDATE songs SET status = ${reason} WHERE id = ${song.id}`;
    return NextResponse.json( {title: song.title}, { status : 400} );
};