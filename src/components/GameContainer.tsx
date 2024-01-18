"use client";

import styles from '../app/page.module.css';

import { MutableRefObject, useRef, useState } from 'react';
import Clue from '@/types/Clue';

import ClueContainer from './ClueContainer';
import Song from '@/types/Song';
import ProgressContainer from './ProgressContainer';
import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import { Game } from '@/types/Game';
import { EnglishLanguage } from '@/constants/Languages';

export default function GameContainer( {game, clues} : {game : Game, clues : Clue[]} ){

    const [ count, setCount ] = useState<number>(0);
    const [inputIndicator, setInputIndicator] = useState<GuessInputIndicatorClass>(GuessInputIndicatorClass.Static);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [queryResults, setQueryResults] = useState<Song[] | null>(null);
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const guessInputRef = useRef(null) as MutableRefObject<HTMLInputElement | null>;
    const firstGuess = useRef(true);

    const solutionClue : Clue = {
        level: 7,
        lyrics: game.lyrics,
        language: EnglishLanguage
    }

    const solutionSong : Song = {
        id: game.solution_id,
        title: "Adele - Set Fire To The Rain",
        thumb: "https://i.discogs.com/aw4hy9OduJjkWwHmlG0Jp4c9LlTdiRRV3yX8e1C3f5E/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI5ODkx/MzAtMTY0OTIxMDc4/OC00MDA2LnBuZw.jpeg"
    }

    const selectSong = (song : Song | null) => {
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
        if(count == 5){
            setGameOver(true);
            setCount(6);
            if(guessInputRef.current) guessInputRef.current.blur();
        }
        else setCount(count + 1);
        
        setTimeout( () => { //await render
            window.scrollTo({
                top: document.body.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }, 1);
    }

    const makeGuess = (song: Song) : void => {
        selectSong(null);
        setQueryResults(null);

        if(guessInputRef.current){
            guessInputRef.current.value = "";
        }

        if(song.id != game.solution_id){
            firstGuess.current = false;
            if(guessInputRef.current) guessInputRef.current.focus();
            nextClue();
        }
        else{
            setGameOver(true);
            setCount(6);
            if(guessInputRef.current) guessInputRef.current.blur();
            setTimeout( () => { //await render
                window.scrollTo({
                    top: document.body.scrollHeight,
                    left: 0,
                    behavior: "smooth",
                });
            }, 1);
        }
    }

    let playButton;
    if(!selectedSong) playButton = (
            <button id={styles["skip-button"]} className={styles["play-button"] + (!firstGuess.current ? " " + styles["incorrect"] : "")} onClick={nextClue}>
                {(count >= 5) ? "Give Up" : "Skip"}
            </button>
        );
    else playButton = (
            <button id={styles["guess-button"]} className={styles["play-button"]} onClick={() => { makeGuess(selectedSong) }}>
                Guess
            </button>
        );

    return(
        <>
            <ProgressContainer clues={clues} count={count} gameOver={gameOver} />
            <div id={styles["clues-container"]} style={{paddingBottom: gameOver ? "0px" : "100px"}}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    return (index <= count) && ( <ClueContainer key={index} clue={clue} /> )
                })
            }
            {
                gameOver && ( 
                    <ClueContainer clue={solutionClue} solution={solutionSong} /> 
                )
            }
            </div>
        
            <div id={styles["play-container"]} className={gameOver ? styles["game-over"] : ""}>
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