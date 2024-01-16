import styles from '../app/page.module.css';

import { useState, useRef } from 'react';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import { GuessInputIndicatorClass } from '@/constants/GuessInputIndicatorClass';

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

    const [queryResults, setQueryResults] = useState<Array<any> | null>(null);
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const [inputIndicator, setInputIndicator] = useState<GuessInputIndicatorClass>(GuessInputIndicatorClass.Static);

    return (
        <div id={styles["play-container"]}>
            <div id={styles["play-gradient"]}></div>
            <div id={styles["guess-container"]}>
                <QueryInput setResults={setQueryResults} setInputIsFocused={setInputIsFocused} inputIndicator={inputIndicator} setInputIndicator={setInputIndicator} />
                <QueryResults results={queryResults} inputIsFocused={inputIsFocused} />
            </div>
            {playButton}
        </div>
    )
}