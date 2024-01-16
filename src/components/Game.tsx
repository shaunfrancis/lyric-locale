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
        setTimeout( () => { //await render
            window.scrollTo({
                top: document.body.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }, 1);
    }

    return(
        <>
            <div id={styles["progress-container"]}>
                {
                    clues.map( (clue : Clue, index : number) => {
                        if(index == 6) return;

                        if(index <= count){
                            const bgSrc = "url(/" + ("squareSrc" in clue.language ? clue.language.squareSrc : clue.language.code) + ".png";
                            return ( <div className={styles["progress-square"]} style={{backgroundImage: bgSrc}}></div> )
                        }
                        else  return ( <div className={styles["progress-square"]}></div> )
                    })
                }
            </div>
            <div id={styles["clues-container"]}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    return (index <= count) && ( <ClueContainer key={index} clue={clue} /> )
                })
            }
            </div>
            <Play nextClue={nextClue} count={count} />
        </>
    )
}