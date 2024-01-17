"use client";

import styles from '../app/page.module.css';

import { MutableRefObject, useRef, useState } from 'react';
import Clue from '../types/Clue';

import ClueContainer from './ClueContainer';
import SongResult from '@/types/SongResult';
import ProgressContainer from './ProgressContainer';
import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import { Game } from '@/types/Game';

export default function GameContainer( {game, clues} : {game : Game, clues : Clue[]} ){

    const [ count, setCount ] = useState<number>(0);
    const [inputIndicator, setInputIndicator] = useState<GuessInputIndicatorClass>(GuessInputIndicatorClass.Static);
    const [selectedSong, setSelectedSong] = useState<SongResult | null>(null);
    const [queryResults, setQueryResults] = useState<SongResult[] | null>(null);
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const guessInputRef = useRef(null) as MutableRefObject<HTMLInputElement | null>;
    const firstGuess = useRef(true);

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

    const nextClue = () : void => {
        setCount(count + 1);
        setTimeout( () => { //await render
            window.scrollTo({
                top: document.body.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }, 1);
    }

    const makeGuess = (song: SongResult) : void => {
        if(song.id != game.solution_id){
            firstGuess.current = false;
            if(guessInputRef.current){
                guessInputRef.current.value = "";
                guessInputRef.current.focus();
            }
            selectSong(null);
            setQueryResults(null);
            nextClue();
        }
        else{
            alert("Winner");
        }
    }

    let playButton;
    const skipText = (count == 5) ? "Give Up" : "Skip";
    if(!selectedSong) playButton = (
            <button id={styles["skip-button"]} className={styles["play-button"] + (!firstGuess.current ? " " + styles["incorrect"] : "")} onClick={nextClue}>
                {skipText}
            </button>
        );
    else playButton = (
            <button id={styles["guess-button"]} className={styles["play-button"]} onClick={() => { makeGuess(selectedSong) }}>
                Guess
            </button>
        );

    return(
        <>
            <ProgressContainer clues={clues} count={count} />
            <div id={styles["clues-container"]}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    return (index <= count) && ( <ClueContainer key={index} clue={clue} /> )
                })
            }
            </div>
        
            <div id={styles["play-container"]}>
                <div id={styles["play-gradient"]}></div>
                <div id={styles["guess-container"]}>
                    <QueryInput guessInputRef={guessInputRef} setResults={setQueryResults} setInputIsFocused={setInputIsFocused} inputIndicator={inputIndicator} setInputIndicator={setInputIndicator} selectSong={selectSong}  />
                    <QueryResults results={queryResults} inputIsFocused={inputIsFocused} selectSong={selectSong} />
                </div>
                {playButton}
            </div>
        </>
    )
}