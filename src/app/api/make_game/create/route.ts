export const dynamic = "force-dynamic";

import authenticate from '@/lib/authenticate';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) : Promise<NextResponse> {
    if(!authenticate(request)) return NextResponse.json( {error : "UNAUTHORISED"}, {status: 401} );

    const { song, lyrics, clues } = await request.json();

    try{
        //create game
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split("T")[0];
        
        let createGameResponse = await fetch(process.env.TS_API_URL + `/make_game/create_game.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( {day: tomorrowString, song_id: song.id, lyrics: lyrics, thumb: song.thumb} )
        });
        if(createGameResponse.status != 200) throw new Error("Create game failed");

        let createGameData = await createGameResponse.json();
        const game_id = createGameData.id;

        let insertCluesResponse = await fetch(process.env.TS_API_URL + `/make_game/insert_clues.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( {id: game_id, clues: clues} )
        });
        if(insertCluesResponse.status != 200) throw new Error("Insert clues failed");

        return NextResponse.json( { title: song.title }, {status:200} );

    }
    catch(err){ return NextResponse.json( {error : err}, {status: 500} ) }
}