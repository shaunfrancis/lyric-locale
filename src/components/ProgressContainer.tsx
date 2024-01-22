import { MutableRefObject, useRef } from 'react';
import styles from '../app/page.module.css';
import Clue from "@/types/Clue";

export default function ProgressContainer( 
    {clues, count, winningCount, gameOver, didWin, clueContainers} : 
    {clues : Clue[], count : number, winningCount : number, gameOver : boolean, didWin : boolean, clueContainers : MutableRefObject<HTMLDivElement | null>[]}
){
    const currentCount = useRef<number>(0);
    if(didWin) currentCount.current = winningCount;
    else currentCount.current = count;

    const scrollTo = (index : number) => {
        if(clueContainers[index].current) clueContainers[index].current!.scrollIntoView();
    }

    return (
        <div id={styles["progress-container"]} className={gameOver ? styles["game-over"] : ""}>
            {
                clues.map( (clue : Clue, index : number) => {
                    if(index == 6) return;

                    if(index <= currentCount.current){
                        const bgSrc = "url(/" + ("squareSrc" in clue.language ? clue.language.squareSrc : clue.language.code) + ".png";
                        return ( 
                            <div key={index} onClick={() => { scrollTo(index) }} className={styles["progress-square"] + " " + styles["occupied"]} style={{backgroundImage: bgSrc}}></div> 
                        )
                    }
                    else return ( <div key={index} className={styles["progress-square"]}></div> )
                })
            }
            {
                gameOver && (
                    <div id={styles["progress-result"]} onClick={() => { scrollTo(6) }} className={didWin ? styles["win"] : styles["loss"]}></div>
                )
            }
        </div>
    )
}