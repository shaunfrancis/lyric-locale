import { useRef } from 'react';
import styles from '../app/page.module.css';
import Clue from "@/types/Clue";

export default function ProgressContainer( {clues, count, gameOver} : {clues : Clue[], count : number, gameOver : boolean} ){
    const currentCount = useRef<number>(0);
    if(!gameOver) currentCount.current = count;

    return (
        <div id={styles["progress-container"]}>
            {
                clues.map( (clue : Clue, index : number) => {
                    if(index == 6) return;

                    if(index <= currentCount.current){
                        const bgSrc = "url(/" + ("squareSrc" in clue.language ? clue.language.squareSrc : clue.language.code) + ".png";
                        return ( <div key={index} className={styles["progress-square"]} style={{backgroundImage: bgSrc}}></div> )
                    }
                    else  return ( <div key={index} className={styles["progress-square"]}></div> )
                })
            }
        </div>
    )
}