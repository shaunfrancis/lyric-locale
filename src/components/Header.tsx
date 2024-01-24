import { Game } from "@/types/Game";
import { MutableRefObject } from "react";

export default function Header( {game, helpPopup} : {game : Game, helpPopup : MutableRefObject<HTMLDivElement | null>} ){
    const openPopup = (popupRef : MutableRefObject<HTMLDivElement | null>) => {
        if(popupRef.current) popupRef.current!.classList.add('visible');
    };

    return(
        <header>
            <div id="tennessine-container">
                <a href="https://tennessine.co.uk" tabIndex={0}>
                    <img src="/tennessine.svg" alt="Tennessine" />
                </a>
            </div>
            <div id="title-container">
                <img src="/logo-icon.svg" alt="" style={{height:"45px"}}/>
                <h1 id="title">
                    <span id="title-name">LyricLocale </span>#{game.id}
                </h1>
            </div>
            <nav>
                <ul>
                    <li id="help-li" role="button" onClick={() => { openPopup(helpPopup) }} onKeyDown={(e) => {if(e.key == "Enter") openPopup(helpPopup)}} tabIndex={0}></li>
                </ul>
            </nav>
        </header>
    );
}