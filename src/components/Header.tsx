import { Game } from "@/types/Game";
import { MutableRefObject, useEffect, useRef } from "react";

export default function Header( 
    {game, helpPopup, settingsPopup} : 
    {game : Game, helpPopup : MutableRefObject<HTMLDivElement | null>, settingsPopup : MutableRefObject<HTMLDivElement | null>} 
){

    const headerRef = useRef(null) as MutableRefObject<HTMLHeadElement | null>;
    useEffect( () => {
        let currentScrollPosition = window.scrollY;
        window.addEventListener('scroll', () => {
            const fullHeight = document.body.scrollHeight - window.innerHeight;

            if(!headerRef.current) return;
            if(window.scrollY > currentScrollPosition) document.body.classList.add('header-hidden');
            else if(window.scrollY < currentScrollPosition) document.body.classList.remove('header-hidden');

            currentScrollPosition = Math.max(0, Math.min(window.scrollY, fullHeight));
        });
    }, []);

    const togglePopup = (popupRef : MutableRefObject<HTMLDivElement | null>) => {
        if(popupRef.current) popupRef.current!.classList.toggle('visible');
    };

    return(
        <header ref={headerRef}>
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