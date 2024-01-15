import mysql from 'mysql2/promise';
import Clue from '../types/Clue';

export default async function getClues() : Promise<Clue[]>{
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try{
        const [results] = await connection.query<Clue[]>( 'SELECT * FROM unnamed_song_game_clues' );
        return results;

    }
    catch(err){ throw new Error() }
}