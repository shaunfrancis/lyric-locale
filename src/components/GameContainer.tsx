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
import Language from '@/types/Language';
import StoredData from '@/types/StoredData';
import uploadScore from '@/lib/uploadScore';

export default function GameContainer( 
    {game, clues, storage, hiddenLanguages} : 
    {game : Game, clues : Clue[], storage: StoredData, hiddenLanguages: Language[]} 
){

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

    useEffect(() => {
        const todaysGame = storage.stats.find( stat => stat.id == game.id );
        if(todaysGame){
            let todaysCount = isNaN(todaysGame.count) ? 0 : todaysGame.count;
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
    }, []);

    const updateStoredStats = (newCount : number, newDidWin : boolean = false) => {
        const todaysGame = storage.stats.find( stat => stat.id == game.id );
        if(todaysGame){
            todaysGame.count = newCount;
            todaysGame.won = newDidWin ? 1 : 0;
        }
        else storage.stats.push({ id: game.id, count: newCount, won: newDidWin ? 1 : 0});

        localStorage.setItem("game-stats", JSON.stringify(storage.stats));
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
            uploadScore(game.id, -1);
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
            nextClue();
        }
        else{
            uploadScore(game.id, count);
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

    return(
        <>            
            <div id={styles["status-container"]}>
                <ProgressContainer clues={clues} clueContainers={clueContainers} count={count} winningCount={winningCount} gameOver={gameOver} didWin={didWin} />
                { gameOver && <ShareContainer id={game.id} count={winningCount} clues={clues} didWin={didWin} /> }
            </div>

            <div id={styles["clues-container"]} className={gameOver ? styles["game-over"] : ""}>
            {   
                clues.map( (clue : Clue, index : number) => {
                    return (index <= count) && ( <ClueContainer key={index} clue={clue} hide={hiddenLanguages} containerRef={clueContainers[index]} /> )
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

            { gameOver && <Countdown gameDay={game.day} /> }
            <ConfettiCanvas didWin={didWin} />
        </>
    )
}