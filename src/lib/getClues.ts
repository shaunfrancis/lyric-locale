import mysql from 'mysql2/promise';
import Clue, { ClueWithoutLanguage } from '../types/Clue';
import { Languages } from '@/constants/Languages';

export default async function getClues() : Promise<Clue[]>{
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try{
        const [results] = await connection.query<ClueWithoutLanguage[]>( 'SELECT * FROM unnamed_song_game_clues' );

        results.forEach( clue => {
            const language = Languages.find( c => c.code == clue.language ) || Languages.find( c => c.code == "missing" );
            clue.language = language;
        });

        return results as Clue[];

    }
    catch(err){ throw new Error() }
}