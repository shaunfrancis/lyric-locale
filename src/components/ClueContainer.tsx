"use client";
import Image from 'next/image';
import styles from '../app/page.module.css';
import Clue from '@/types/Clue';
import Song from '@/types/Song';
import { MutableRefObject } from 'react';

export default function ClueContainer( 
    { clue, solution = undefined, currentClue = undefined } : 
    { clue : Clue, solution? : Song, currentClue? : MutableRefObject<HTMLDivElement | null> } 
){
    return (
        <div className={styles["clue-container"]} ref={currentClue}>
            <div className={styles["language-container"]}>
                <div className={styles["language-english-name"] + " " + styles["language-name"]}>{clue.language.enName}</div>
                <div className={styles["language-name"]}>{clue.language.localName}</div>
                <Image src={"/" + clue.language.code + ".png"} alt={clue.language.enName} width={70 / clue.language.ratio} height={70} />
            </div>
            <div className={styles["lyric-container"]}>
                <img className={styles["lyric-flag-blur"]} src={"/" + clue.language.code + ".png"}/>
                {
                    solution && (
                        <div id={styles["solution-container"]}>
                            <img src={solution.thumb} alt={solution.title}/>
                            <span>{solution.title}</span>
                        </div>
                    )
                }
                {   clue.lyrics.split("\n").map( (line, j) => {
                        return(<div className={styles["lyric-line"]} key={j}>{line}</div>)
                    })
                }
            </div>
        </div>
    )
}