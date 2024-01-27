export const dynamic = "force-dynamic";

import { sql } from '@vercel/postgres';

export async function GET(request: Request) : Promise<Response> {

    const song = {id: -1, title: ""};

    try{

        const clues = [[0,'en','lyrics'],[0,'en','lyrics'],[0,'en','lyrics'],[0,'en','lyrics'],[0,'en','lyrics'],[0,'en','lyrics']];
        const discogsSong = {id: -1, thumb: "thumb"};
        const lyrics = "enlyrics";

        //create game
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split("T")[0];

        await sql`INSERT INTO games (day, song_id, solution_id, lyrics, thumb) VALUES (${tomorrowString}, ${song.id},${discogsSong.id},${lyrics},${discogsSong.thumb})`;
        
        const { rows: id_check } = await sql`SELECT id FROM games WHERE day = ${tomorrowString}`;
        const game_id = id_check[0].id;
        
        await sql`INSERT INTO clues (game_id, level, language, lyrics) VALUES
            (${game_id}, ${clues[0][0]}, ${clues[0][1]}, ${clues[0][2]}),
            (${game_id}, ${clues[1][0]}, ${clues[1][1]}, ${clues[1][2]}),
            (${game_id}, ${clues[2][0]}, ${clues[2][1]}, ${clues[2][2]}),
            (${game_id}, ${clues[3][0]}, ${clues[3][1]}, ${clues[3][2]}),
            (${game_id}, ${clues[4][0]}, ${clues[4][1]}, ${clues[4][2]}),
            (${game_id}, ${clues[5][0]}, ${clues[5][1]}, ${clues[5][2]})
        `;

        await sql`UPDATE songs SET status = 9 WHERE id = ${song.id}`;
        return Response.json( { status : 200, title: song.title } );

    }
    catch(err){ return Response.json( {status : 500, error : err} ) }
}