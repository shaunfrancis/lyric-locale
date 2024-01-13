import Image from 'next/image'
import styles from './page.module.css'

import getClues from '../lib/getClues';

export default async function Home() {
    const clues = await getClues();

    return (
    <main className={styles.main}>
        {   clues.map( (clue, index) => {
                return (<p style={{whiteSpace: "pre-line"}} key={index}> {clue.lyrics} </p>)
            })
        }
    </main>
    )
}