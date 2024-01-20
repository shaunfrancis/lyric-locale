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
    const [didWin, setDidWin] = useState<boolean>(false);
    const guessInputRef = useRef(null) as MutableRefObject<HTMLInputElement | null>;
    const currentClue = useRef(null) as MutableRefObject<HTMLDivElement | null>;
    const firstGuess = useRef(true);

    const solutionClue : Clue = {
        level: 7,
        lyrics: game.lyrics,
        language: EnglishLanguage
    }

    const solutionSong : Song = {
        id: game.solution_id,
        title: game.title,
        thumb: game.thumb
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
            if(currentClue.current) currentClue.current.scrollIntoView({ behavior: "smooth" });
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
            setDidWin(true);
            setGameOver(true);
            setCount(6);
            if(guessInputRef.current) guessInputRef.current.blur();
            setTimeout( () => { //await render
                if(currentClue.current) currentClue.current.scrollIntoView({ behavior: "smooth" });
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

        async function tempcreatenewgame(){
            const x = await fetch("/api/make_game");
            const y = await x.json();
            console.log(y);
        }
    return(
        <>
            <button onClick={tempcreatenewgame} style={{position:"absolute",top:"60px",left:"20px",display:"none"}}>CREATE NEW GAME</button>
            <h1 id={styles["title"]}>LyricLocale #{game.id}</h1>
            <ProgressContainer clues={clues} count={count} gameOver={gameOver} didWin={didWin} />
            <div id={styles["clues-container"]} style={{paddingBottom: gameOver ? "0px" : "100px"}}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    let currentClueProp;
                    if(!gameOver && index == count) currentClueProp = currentClue;

                    return (index <= count) && ( <ClueContainer key={index} clue={clue} currentClue={currentClueProp} /> )
                })
            }
            {
                gameOver && ( 
                    <ClueContainer clue={solutionClue} solution={solutionSong} currentClue={currentClue} /> 
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