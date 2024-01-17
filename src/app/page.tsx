import Image from 'next/image';
import styles from './page.module.css';

import getGame from '../lib/getGame';
import getClues from '../lib/getClues';

import GameContainer from '../components/GameContainer';

export default async function Home() {
    const game = await getGame();
    const clues = await getClues(game.id);

    return (
    <main>
        <GameContainer game={game} clues={clues} />
    </main>
    )
}