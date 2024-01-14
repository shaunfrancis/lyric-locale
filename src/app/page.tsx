import Image from 'next/image';
import styles from './page.module.css';

import getClues from '../lib/getClues';

import Game from '../components/Game';

export default async function Home() {
    const clues = await getClues();

    return (
    <main>
        <Game clues={clues} />
    </main>
    )
}