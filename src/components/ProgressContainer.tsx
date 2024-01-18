import { useRef } from 'react';
import styles from '../app/page.module.css';
import Clue from "@/types/Clue";

export default function ProgressContainer( 
    {clues, count, gameOver, didWin} : {clues : Clue[], count : number, gameOver : boolean, didWin : boolean}
){
    const currentCount = useRef<number>(0);
    if(!gameOver) currentCount.current = count;

    return (
        <div id={styles["progress-container"]} className={gameOver ? styles["game-over"] : ""}>
            {
                clues.map( (clue : Clue, index : number) => {
                    if(index == 6) return;

                    if(index <= currentCount.current){
                        const bgSrc = "url(/" + ("squareSrc" in clue.language ? clue.language.squareSrc : clue.language.code) + ".png";
                        return ( <div key={index} className={styles["progress-square"]} style={{backgroundImage: bgSrc}}></div> )
                    }
                    else return ( <div key={index} className={styles["progress-square"]}></div> )
                })
            }
            {
                gameOver && (
                    <div id={styles["progress-result"]} className={didWin ? styles["win"] : styles["loss"]}></div>
                )
            }
        </div>
    )
}