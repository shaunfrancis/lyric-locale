import { Game } from '@/types/Game';
import mysql from 'mysql2/promise';

export default async function getGame() : Promise<Game>{
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try{
        const [results] = await connection.query<Game[]>( 'SELECT id, solution_id, title, lyrics, thumb FROM unnamed_song_game_games ORDER BY id DESC LIMIT 1' );
        return results[0] as Game;

    }
    catch(err){ throw new Error() }
}