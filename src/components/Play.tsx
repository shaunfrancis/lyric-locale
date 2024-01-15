import styles from '../app/page.module.css';

import { useState, useRef } from 'react';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';

export default function Play( {nextClue, count, max} : {nextClue : () => void, count : number, max : number} ){
    const skipText = (count == max) ? "Give Up" : "Skip";

    const [choice, setChoice] = useState<string>("");
    let playButton;
    if(choice == ""){
        playButton = <button id={styles["skip-button"]} className={styles["play-button"]} onClick={nextClue}>{skipText}</button>;
    }
    else{
        playButton = <button id={styles["guess-button"]} className={styles["play-button"]} onClick={nextClue}>Guess</button>;
    }

    const [queryResults, setQueryResults] = useState<Array<any>>([]);
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);

    return (
        <div id={styles["play-container"]}>
            <div id={styles["play-gradient"]}></div>
            <div id={styles["guess-container"]}>
                <QueryInput setResults={setQueryResults} setInputIsFocused={setInputIsFocused} />
                <QueryResults results={queryResults} inputIsFocused={inputIsFocused} />
            </div>
            {playButton}
        </div>
    )
}