import { unstable_noStore as noStore } from 'next/cache';
import { DefaultLanguage, Languages } from '@/constants/Languages';
import Clue from '@/types/Clue';

export default async function postgresGetClues(id : number){
    noStore();

    const failedClues : Clue[] = Array(6).fill({level: -1, lyrics: "Missing Data", language: DefaultLanguage});

    try{
        const request = await fetch(process.env.TS_API_URL + "/clues.php?id=" + id);
        const rows : any[] = await request.json();

        if(rows.length != 6) return failedClues;
        
        rows.forEach( clue => {
            const language = Languages.find( c => c.code == clue.language ) || DefaultLanguage;
            clue.language = language;
        });

        return rows as Clue[];
    }
    catch(error){
        return failedClues;
    }
}