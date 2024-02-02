import { Game } from '@/types/Game';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export default async function getGame(){
    noStore();

    const { rows } = await sql`SELECT games.id, games.day, games.song_id, songs.title, games.lyrics, games.thumb FROM games JOIN songs ON songs.id = games.song_id WHERE games.day = ${(new Date()).toISOString().split("T")[0]} ORDER BY games.id DESC LIMIT 1`;

    if(rows.length == 0) return {id: -1, song_id: -1, title: "Missing Data", lyrics: "Missing Data", thumb: "/missing.png"} as Game;
    else return rows[0] as Game;
}