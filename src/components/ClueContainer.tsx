"use client";

import styles from '../app/page.module.css';
import Clue from '@/types/Clue';
import Song from '@/types/Song';
import { MutableRefObject } from 'react';
import { EnglishLanguage } from '@/constants/Languages';
import Language from '@/types/Language';

export default function ClueContainer( 
    { clue, containerRef, hide, solution = undefined } : 
    { clue : Clue, containerRef : MutableRefObject<HTMLDivElement | null>, hide? : Language[], solution? : Song } 
){

    let lyricsContent : JSX.Element | JSX.Element[];
    if(hide && hide.map(l => l.code).includes(clue.language.code)) lyricsContent = <div className={styles["lyric-line"] + " " + styles["hidden"]}>You chose to hide {clue.language.enName} from your game. Change your settings to display this language.</div>;
    else lyricsContent = clue.lyrics.split("\n").map( (line, j) => {
        if(line.trim() == "") return(<br key={j} />)
        else return(<div className={styles["lyric-line"]} key={j}>{line}</div>)
    })

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
                {lyricsContent}
            </div>
        </div>
    )
}