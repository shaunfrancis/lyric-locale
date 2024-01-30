"use client";

import Clue from "@/types/Clue";
import { Game } from "@/types/Game";
import HelpContainer from "./HelpContainer";
import GameContainer from "./GameContainer";
import Header from "./Header";
import { MutableRefObject, useReducer, useRef } from "react";
import SettingsContainer from "./SettingsContainer";
import parseLocalStorage from "@/lib/parseLocalStorage";
import StoredData from "@/types/StoredData";
import Language from "@/types/Language";
import { Languages } from "@/constants/Languages";

function updateHiddenLanguages(hiddenLanguages : Language[], action : {type: string, value: string}) : Language[]{
    const newLanguage = Languages.find( l => l.code == action.value );
    const isAlreadyInArray = !!(hiddenLanguages.find(l => l.code == action.value));

    if(action.type == "toggle") action.type = isAlreadyInArray ? "remove" : "add";

    switch(action.type){
        case "add": return (isAlreadyInArray || !newLanguage) ? hiddenLanguages : [...hiddenLanguages, newLanguage]; 
        case "remove": return hiddenLanguages.filter( l => l.code != action.value );
        default: return hiddenLanguages;
    }
}

export default function ClientHomeContainer( {game, clues} : {game: Game, clues: Clue[]} ){
    const helpPopup = useRef<HTMLDivElement | null>(null);
    const settingsPopup = useRef<HTMLDivElement | null>(null);

    const storage = useRef(parseLocalStorage()) as MutableRefObject<StoredData>;
    const hiddenLanguagesInit = storage.current.settings.hide.filter(st => Languages.find(l => l.code == st)).map(st => Languages.find(l => l.code == st)) as Language[];
    const [hiddenLanguages, hiddenLanguagesDispatch] = useReducer(updateHiddenLanguages, hiddenLanguagesInit);

    return( <>
        <Header game={game} helpPopup={helpPopup} settingsPopup={settingsPopup} />
        <main>
            <HelpContainer helpPopup={helpPopup} />
            <SettingsContainer settingsPopup={settingsPopup} storage={storage.current} hiddenLanguages={hiddenLanguages} hiddenLanguagesDispatch={hiddenLanguagesDispatch} />
            <GameContainer game={game} clues={clues} storage={storage.current} hiddenLanguages={hiddenLanguages}/>
        </main>
    </> );
}