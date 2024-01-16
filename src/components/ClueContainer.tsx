"use client";
import Image from 'next/image';
import Clue from '../types/Clue';
import styles from '../app/page.module.css';

export default function ClueContainer( { clue } : { clue : Clue } ){
    return (
        <div className={styles["clue-container"]}>
            <div className={styles["language-container"]}>
                <div className={styles["language-english-name"] + " " + styles["language-name"]}>{clue.language.enName}</div>
                <div className={styles["language-name"]}>{clue.language.localName}</div>
                <Image src={"/" + clue.language.code + ".png"} alt={clue.language.enName} width={70 / clue.language.ratio} height={70} />
            </div>
            <div className={styles["lyric-container"]}>
                <img className={styles["lyric-flag-blur"]} src={"/" + clue.language.code + ".png"}/>
                {   clue.lyrics.split("\n").map( (line, j) => {
                        return(<div className={styles["lyric-line"]} key={j}>{line}</div>)
                    })
                }
            </div>
        </div>
    )
}