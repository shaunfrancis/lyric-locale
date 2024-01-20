import { Game } from '@/types/Game';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export default async function getGame(){
    noStore();
    const { rows } = await sql`SELECT games.id, games.solution_id, songs.title, games.lyrics, games.thumb FROM games JOIN songs ON songs.id = games.song_id ORDER BY id DESC LIMIT 1`;
    return rows[0] as Game;
}