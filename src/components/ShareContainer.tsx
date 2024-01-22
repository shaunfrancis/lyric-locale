import Clue from '@/types/Clue';
import styles from '../app/page.module.css';
import { useRef } from 'react';

export default function ShareContainer( 
    {id, count, clues, didWin} : {id : number, count : number, clues : Clue[], didWin : boolean}
){
    
    let shareText = `LyricLocale #${id} ${didWin ? (count+1) : "X"}/6\n\n`;

    for(let index = 0; index < 6; index++){
        if(index <= count || count == -1) shareText += clues[index].language.flag;
        else shareText += "⬛️";
    }
    shareText += didWin ? "✅" : "❌";

    shareText += "\n\nlyriclocale.tennessine.co.uk";

    const copySpan = useRef<HTMLSpanElement | null>(null);
    const copyShareText = () => {
        navigator.clipboard.writeText(shareText);
        if(copySpan.current){
            copySpan.current!.innerHTML = "Copied!";
            setTimeout( () => {
                if(copySpan.current) copySpan.current!.innerHTML = "Copy";
            }, 1000);
        }
    };

    return (
        <div id={styles["share-container"]}>
            <button className={styles["share-button"]} onClick={copyShareText}>
                <img src="/copy.svg" alt="Copy"/>
                <span ref={copySpan}>Copy</span>
            </button>
            <button className={styles["share-button"]} onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${"%23" + encodeURIComponent(shareText)}`, '_blank') }}>
                <img src="/x-logo.svg" alt="Tweet"/>
                <span>Tweet</span>
            </button>
        </div>
    )
}