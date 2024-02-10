import { Game } from '@/types/Game';
import { unstable_noStore as noStore } from 'next/cache';

export default async function getGame(){
    noStore();

    const failedGame : Game = {id: -1, day: (new Date()).toISOString().split("T")[0], song_id: -1, title: "Missing Data", lyrics: "Missing Data", thumb: "/missing.png"};

    try{
        const request = await fetch(process.env.TS_API_URL + "/game.php");
        const data = await request.json();

        if(data.length == 0) return failedGame;
        else return data[0] as Game;
    }
    catch(error){
        return failedGame;
    }
}