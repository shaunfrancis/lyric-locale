"use client";

import styles from '../app/page.module.css';

import { useState } from 'react';
import Clue from '../types/Clue';

import ClueContainer from './ClueContainer';
import Play from './Play';

export default function Game( {clues} : {clues : Clue[]} ){
    const [ count, setCount ] = useState<number>(0);

    function nextClue() : void {
        setCount(count + 1);
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    }

    return(
        <>
            <div id={styles["clues-container"]}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    return (index <= count) && ( <ClueContainer key={index} clue={clue} /> )
                })
            }
            </div>
            <Play nextClue={nextClue} count={count} max={clues.length - 2} />
        </>
    )
}