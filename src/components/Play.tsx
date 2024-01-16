import styles from '../app/page.module.css';

import { useState, useRef, MutableRefObject } from 'react';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import SongResult from '@/types/SongResult';

export default function Play( {nextClue, count, max} : {nextClue : () => void, count : number, max : number} ){

    const [queryResults, setQueryResults] = useState<Array<SongResult> | null>(null);
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const [inputIndicator, setInputIndicator] = useState<GuessInputIndicatorClass>(GuessInputIndicatorClass.Static);
    const guessInputRef = useRef(null) as MutableRefObject<HTMLInputElement | null>;

    const [selectedSong, setSelectedSong] = useState<SongResult | null>(null);

    const selectSong = (song : SongResult | null) => {
        setSelectedSong(song);

        if(song){
            if(guessInputRef.current){
                guessInputRef.current.value = song.title;
                guessInputRef.current.blur();
            }
            setInputIndicator(GuessInputIndicatorClass.Selected);
        }
        else{
            setInputIndicator(GuessInputIndicatorClass.Static);
            if(guessInputRef.current){
                guessInputRef.current.value = "";
                guessInputRef.current.focus();
            }
        }
    }

    let playButton;
    const skipText = (count == max) ? "Give Up" : "Skip";
    if(!selectedSong){
        playButton = <button id={styles["skip-button"]} className={styles["play-button"]} onClick={nextClue}>{skipText}</button>;
    }
    else{
        playButton = <button id={styles["guess-button"]} className={styles["play-button"]} onClick={nextClue}>Guess</button>;
    }

    return (
        <div id={styles["play-container"]}>
            <div id={styles["play-gradient"]}></div>
            <div id={styles["guess-container"]}>
                <QueryInput guessInputRef={guessInputRef} setResults={setQueryResults} setInputIsFocused={setInputIsFocused} inputIndicator={inputIndicator} setInputIndicator={setInputIndicator} selectedSong={selectedSong} />
                <QueryResults results={queryResults} inputIsFocused={inputIsFocused} selectSong={selectSong} />
            </div>
            {playButton}
        </div>
    )
}