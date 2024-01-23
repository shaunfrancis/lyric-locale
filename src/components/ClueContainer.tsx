"use client";
import Image from 'next/image';
import styles from '../app/page.module.css';
import Clue from '@/types/Clue';
import Song from '@/types/Song';
import { MutableRefObject } from 'react';
import { EnglishLanguage } from '@/constants/Languages';

export default function ClueContainer( 
    { clue, containerRef, solution = undefined } : 
    { clue : Clue, containerRef : MutableRefObject<HTMLDivElement | null>, solution? : Song } 
){
    return (
        <div className={styles["clue-container"]} ref={containerRef}>
            <div className={styles["language-container"]}>
                <img src={"/" + clue.language.code + ".png"} alt="" />
                <div className={styles["language-name"]}>{clue.language.localName}</div>
                { clue.language != EnglishLanguage && 
                    ( <div className={styles["language-english-name"] + " " + styles["language-name"]}>{clue.language.enName}</div> )
                }
            </div>
            <div className={styles["lyric-container"]}>
                <img className={styles["lyric-flag-blur"]} alt="" src={"/" + clue.language.code + ".png"}/>
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