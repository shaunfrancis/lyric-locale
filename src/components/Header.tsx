import { Game } from "@/types/Game";
import { MutableRefObject } from "react";

export default function Header( 
    {game, helpPopup, settingsPopup} : 
    {game : Game, helpPopup : MutableRefObject<HTMLDivElement | null>, settingsPopup : MutableRefObject<HTMLDivElement | null>} 
){

    const togglePopup = (popupRef : MutableRefObject<HTMLDivElement | null>) => {
        if(popupRef.current) popupRef.current!.classList.toggle('visible');
    };

    return(
        <header>
            <div id="tennessine-container">
                <a href="https://tennessine.co.uk" tabIndex={0}>
                    <img src="/tennessine.svg" alt="Tennessine" />
                </a>
            </div>
            <div id="title-container">
                <img src="/logo-icon.svg" alt=""/>
                <h1 id="title">
                    <span id="title-name">LyricLocale </span>#{game.id}
                </h1>
            </div>
            <nav>
                <ul>
                    <li id="help-li" role="button" onClick={() => { togglePopup(helpPopup) }} onKeyDown={(e) => {if(e.key == "Enter") togglePopup(helpPopup)}} tabIndex={0}></li>
                    <li id="settings-li" role="button" onClick={() => { togglePopup(settingsPopup) }} onKeyDown={(e) => {if(e.key == "Enter") togglePopup(settingsPopup)}} tabIndex={0}></li>
                </ul>
            </nav>
        </header>
    );
}