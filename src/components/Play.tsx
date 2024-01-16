import styles from '../app/page.module.css';

import { useState, useRef, MutableRefObject } from 'react';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import SongResult from '@/types/SongResult';

export default function Play( {nextClue, count} : {nextClue : () => void, count : number} ){

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
        else setInputIndicator(GuessInputIndicatorClass.Static);
    }

    let playButton;
    const skipText = (count == 5) ? "Give Up" : "Skip";
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
                <QueryInput guessInputRef={guessInputRef} setResults={setQueryResults} setInputIsFocused={setInputIsFocused} inputIndicator={inputIndicator} setInputIndicator={setInputIndicator} selectSong={selectSong}  />
                <QueryResults results={queryResults} inputIsFocused={inputIsFocused} selectSong={selectSong} />
            </div>
            {playButton}
        </div>
    )
}