import styles from '../app/page.module.css';
import Clue from "@/types/Clue";

export default function ProgressContainer( {clues, count} : {clues : Clue[], count : number} ){
    return (
        <div id={styles["progress-container"]}>
            {
                clues.map( (clue : Clue, index : number) => {
                    if(index == 6) return;

                    if(index <= count){
                        const bgSrc = "url(/" + ("squareSrc" in clue.language ? clue.language.squareSrc : clue.language.code) + ".png";
                        return ( <div key={index} className={styles["progress-square"]} style={{backgroundImage: bgSrc}}></div> )
                    }
                    else  return ( <div key={index} className={styles["progress-square"]}></div> )
                })
            }
        </div>
    )
}