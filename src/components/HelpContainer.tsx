import { MutableRefObject, useEffect } from "react";
import Popup from "./Popup";

export default function HelpContainer({ helpPopup : popupRef } : { helpPopup : MutableRefObject<HTMLDivElement | null>}){
    
    useEffect( () => {
        if(!localStorage.getItem("has-visited-before")){
            if(popupRef.current) popupRef.current!.classList.add('visible');
            localStorage.setItem("has-visited-before", "1");
        }
    }, []);

    return (
        <Popup popupRef={popupRef}>
            <h1>
                <img src="/logo-icon.svg" alt="" style={{height:"45px"}}/>
                <span>LyricLocale</span>
            </h1>
            <h2>How To Play</h2>
            <p>Try to guess the song!</p>
            <p>The first few lines of a well-known song are translated into a different language. Can you work out enough words to guess the track?</p>
            <p>If you're stuck, you can skip to the next clue: the same lines again, but translated into a new language. There are six different-language clues every day; try to guess the song in as few clues as possible.</p>
            <p>There's a new LyricLocale every day - good luck!</p>
        </Popup>
    )
}