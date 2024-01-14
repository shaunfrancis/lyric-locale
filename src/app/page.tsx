import Image from 'next/image'
import styles from './page.module.css'

import { Languages } from '../constants/languages';
import getClues from '../lib/getClues';

export default async function Home() {
    const clues = await getClues();

    return (
    <main>
        <div id={styles["clues-container"]}>
        {   clues.map( (clue, i) => {
                const lang = clue.language in Languages ? Languages[clue.language] : Languages.missing;

                return (
                <div className={styles["clue-container"]}>
                    <div className={styles["language-container"]}>
                        <div className={styles["language-english-name"] + " " + styles["language-name"]}>{lang.enName}</div>
                        <div className={styles["language-local-name"] + " " + styles["language-name"]}>{lang.localName}</div>
                        <Image src={"/" + clue.language + ".png"} alt={lang.enName} width={70 / lang.ratio} height={70} />
                    </div>
                    <div className={styles["lyric-container"]} key={i}>
                        <img className={styles["lyric-flag-blur"]} src={"/" + clue.language + ".png"}/>
                        {   clue.lyrics.split("\n").map( (line, j) => {
                                return(<div className={styles["lyric-line"]} key={j}>{line}</div>)
                            })
                        }
                    </div>
                </div>
                )

            })
        }
        </div>
        <div id={styles["game-container"]}>
            <div id={styles["guess-container"]}>
                <input type="text" id={styles["guess-input"]} />
            </div>
            <button id={styles["skip-button"]}>Skip</button>
        </div>
    </main>
    )
}