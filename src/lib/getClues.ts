import { unstable_noStore as noStore } from 'next/cache';
import { DefaultLanguage, Languages } from '@/constants/Languages';
import Clue from '@/types/Clue';
import { sql } from '@vercel/postgres';

export default async function postgresGetClues(id : number){
    noStore();

    const { rows } = await sql`SELECT level, language, lyrics FROM clues WHERE game_id = ${id} ORDER BY level ASC`;

    if(rows.length != 6) return Array(6).fill({level: -1, lyrics: "Missing Data", language: DefaultLanguage});
    
    rows.forEach( clue => {
        const language = Languages.find( c => c.code == clue.language ) || DefaultLanguage;
        clue.language = language;
    });

    return rows as Clue[];
}