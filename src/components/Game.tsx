"use client";

import styles from '../app/page.module.css';

import { useState } from 'react';

import Clue from './Clue';
import Play from './Play';

export default function Game(props){
    const clues = props.clues;
    const [ count, setCount ] = useState<number>(0);

    function nextClue(){
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
                clues.map( (clue, index) => {
                    return (index <= count) && ( <Clue key={index} {...clue} /> )
                })
            }
            </div>
            <Play nextClue={nextClue} />
        </>
    )
}