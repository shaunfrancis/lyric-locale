import Image from 'next/image';
import styles from './page.module.css';

import getGame from '../lib/getGame';
import getClues from '../lib/getClues';

import GameContainer from '../components/GameContainer';

export default async function Home() {
    const game = await getGame();
    const clues = await getClues(game.id);

    return ( <>
    <header>
        <div id="tennessine-container">
            <img src="/tennessine.svg" alt="Tennessine" style={{height:"21px"}}/>
        </div>
        <div id="title-container">
            <img src="/logo-icon.svg" style={{height:"45px"}}/>
            <h1 id="title">
                <span id="title-name">LyricLocale </span>#{game.id}
            </h1>
        </div>
        <nav>Buttons Here</nav>
    </header>
    <main>
        <GameContainer game={game} clues={clues} />
    </main>
    </> )
}