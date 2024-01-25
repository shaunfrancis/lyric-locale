"use client";

import styles from '../app/page.module.css';

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import Clue from '@/types/Clue';

import ClueContainer from './ClueContainer';
import Song from '@/types/Song';
import ProgressContainer from './ProgressContainer';
import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import { Game } from '@/types/Game';
import { EnglishLanguage } from '@/constants/Languages';
import ConfettiCanvas from './ConfettiCanvas';
import ShareContainer from './ShareContainer';
import Countdown from './Countdown';

export default function GameContainer( {game, clues} : {game : Game, clues : Clue[]} ){

    const [count, setCount] = useState<number>(0);
    const [inputIndicator, setInputIndicator] = useState<GuessInputIndicatorClass>(GuessInputIndicatorClass.Static);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [queryResults, setQueryResults] = useState<Song[] | null>(null);
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [didWin, setDidWin] = useState<boolean>(false);
    const [winningCount, setWinningCount] = useState<number>(-1);
    const guessInputRef = useRef(null) as MutableRefObject<HTMLInputElement | null>;
    const firstGuess = useRef(true);
    const clueContainers = Array.from(Array(7), () => useRef(null) as MutableRefObject<HTMLDivElement | null>);

    let storedStats = useRef([]) as MutableRefObject<{id : number, count : number, won : number}[]>;
    useEffect(() => {
        if(!localStorage.getItem("game-stats")) localStorage.setItem("game-stats", "[]");
        else{
            const stats = JSON.parse(localStorage.getItem("game-stats")!);
            if(!stats || !Array.isArray(stats)) return localStorage.setItem("game-stats", "[]");

            stats.forEach( stat => {
                const isValidType = ["id","count","won"].every( k => k in stat && typeof stat[k] == "number" );
                if(typeof stat === "object" && isValidType) storedStats.current.push(stat);
            });

            const todaysGame = stats.find( stat => stat.id == game.id );
            if(todaysGame){
                let todaysCount = isNaN(parseInt(todaysGame.count)) ? 0 : parseInt(todaysGame.count);
                todaysCount = Math.max(0, Math.min(6, todaysCount));

                if("won" in todaysGame && todaysGame.won == 1){
                    setWinningCount(todaysCount);
                    setDidWin(true);
                    setGameOver(true);
                    setCount(6);
                }
                else{
                    if(todaysCount == 6) setGameOver(true);
                    setCount(todaysCount);
                }
            }
        }
    }, []);

    const updateStoredStats = (newCount : number, newDidWin : boolean = false) => {
        const todaysGame = storedStats.current.find( stat => stat.id == game.id );
        if(todaysGame){
            todaysGame.count = newCount;
            todaysGame.won = newDidWin ? 1 : 0;
        }
        else storedStats.current.push({ id: game.id, count: newCount, won: newDidWin ? 1 : 0});

        localStorage.setItem("game-stats", JSON.stringify(storedStats.current));
    }

    useEffect(() => {
        if(count == 0) return;
        if(clueContainers[count].current) clueContainers[count].current!.scrollIntoView({ behavior: "smooth" });
    }, [count]);
    

    const solutionClue : Clue = { level: 7, lyrics: game.lyrics, language: EnglishLanguage }
    const solutionSong : Song = { id: game.solution_id, title: game.title, thumb: game.thumb }

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
        updateStoredStats(count + 1);
        if(count == 5){
            setGameOver(true);
            setCount(6);
            if(guessInputRef.current) guessInputRef.current.blur();
        }
        else setCount(count + 1);
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
            updateStoredStats(count, true);
            setWinningCount(count);
            setDidWin(true);
            setGameOver(true);
            setCount(6);
            if(guessInputRef.current) guessInputRef.current.blur();
        }
    }

    let playButton;
    if(!selectedSong) playButton = (
            <button id={styles["skip-button"]} className={styles["play-button"] + (!firstGuess.current ? " " + styles["incorrect"] : "")} onClick={nextClue} disabled={gameOver} tabIndex={3}>
                {(count >= 5) ? "Give Up" : "Skip"}
            </button>
        );
    else playButton = (
            <button id={styles["guess-button"]} className={styles["play-button"]} onClick={() => { makeGuess(selectedSong) }} tabIndex={3}>
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
            
            <div id={styles["status-container"]}>
                <ProgressContainer clues={clues} clueContainers={clueContainers} count={count} winningCount={winningCount} gameOver={gameOver} didWin={didWin} />
                { gameOver && <ShareContainer id={game.id} count={winningCount} clues={clues} didWin={didWin} /> }
            </div>

            <div id={styles["clues-container"]} style={{paddingBottom: gameOver ? "0px" : "100px"}}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    return (index <= count) && ( <ClueContainer key={index} clue={clue} containerRef={clueContainers[index]} /> )
                })
            }
            {
                gameOver && ( 
                    <ClueContainer clue={solutionClue} solution={solutionSong} containerRef={clueContainers[6]} /> 
                )
            }
            </div>
        
            <div id={styles["play-container"]} className={gameOver ? styles["game-over"] : ""}>
                <div id={styles["play-gradient"]}></div>
                <div id={styles["guess-container"]}>
                    <QueryInput guessInputRef={guessInputRef} setResults={setQueryResults} setInputIsFocused={setInputIsFocused} inputIndicator={inputIndicator} setInputIndicator={setInputIndicator} selectSong={selectSong} game={game} gameOver={gameOver} />
                    <QueryResults results={queryResults} inputIsFocused={inputIsFocused} selectSong={selectSong} />
                </div>
                {playButton}
            </div>

            { gameOver && <Countdown /> }
            <ConfettiCanvas didWin={didWin} />
        </>
    )
}