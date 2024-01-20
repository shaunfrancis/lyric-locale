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
        const [results] = await connection.query<Game[]>( 'SELECT games.id, games.solution_id, songs.title, games.lyrics, games.thumb FROM unnamed_song_game_games as games JOIN unnamed_song_game_songs as songs ON songs.id = games.song_id ORDER BY id DESC LIMIT 1' );
        return results[0] as Game;

    }
    catch(err){ throw new Error() }
}