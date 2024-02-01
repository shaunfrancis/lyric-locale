"use client";

import Clue from "@/types/Clue";
import { Game } from "@/types/Game";
import HelpContainer from "./HelpContainer";
import GameContainer from "./GameContainer";
import Header from "./Header";
import { MutableRefObject, useEffect, useReducer, useRef, useState } from "react";
import SettingsContainer from "./SettingsContainer";
import parseLocalStorage from "@/lib/parseLocalStorage";
import StoredData from "@/types/StoredData";
import Language from "@/types/Language";
import { Languages } from "@/constants/Languages";
import StatsContainer from "./StatsContainer";
import getStreaks from "@/lib/getStreaks";

function updateHiddenLanguages(hiddenLanguages : Language[], action : {type: string, value: string | string[]}) : Language[]{
    const update = (list : Language[], value : string) => {
        const newLanguage = Languages.find( l => l.code == value );
        const isAlreadyInArray = !!(list.find(l => l.code == value));

        if(action.type == "toggle") action.type = isAlreadyInArray ? "remove" : "add";

        switch(action.type){
            case "add": return (isAlreadyInArray || !newLanguage) ? list : [...list, newLanguage]; 
            case "remove": return list.filter( l => l.code != value );
            default: return list;
        }
    }

    if(Array.isArray(action.value)){
        let newHiddenLanguages = [...hiddenLanguages];
        action.value.forEach( value => newHiddenLanguages = update(newHiddenLanguages, value) );
        return newHiddenLanguages;
    }
    else return update(hiddenLanguages, action.value);
}

export default function ClientHomeContainer( {game, clues} : {game: Game, clues: Clue[]} ){
    const helpPopup = useRef<HTMLDivElement | null>(null);
    const settingsPopup = useRef<HTMLDivElement | null>(null);
    const statsPopup = useRef<HTMLDivElement | null>(null);

    const [storage, setStorage] = useState<StoredData>({stats: [], settings: {hide:[]}});
    const [streak, updateStreak] = useState(-1);
    const [bestStreak, updateBestStreak] = useState(0);
    const [hiddenLanguages, hiddenLanguagesDispatch] = useReducer(updateHiddenLanguages, []);

    useEffect( () => { 
        setStorage(parseLocalStorage());
    }, []);

    let init = useRef(true);
    useEffect( () => {
        if(init.current){
            init.current = false;
            return;
        }
        const { initialStreak, bestStreak } = getStreaks(game.id, storage);
        updateStreak(initialStreak);
        updateBestStreak(bestStreak);
        hiddenLanguagesDispatch({type:"add", value:storage.settings.hide});
    }, [storage]);

    return( <>
        <Header game={game} helpPopup={helpPopup} settingsPopup={settingsPopup} statsPopup={statsPopup} streak={streak} />
        <main>
            <StatsContainer statsPopup={statsPopup} streak={streak} bestStreak={bestStreak} />
            <HelpContainer helpPopup={helpPopup} />
            <SettingsContainer settingsPopup={settingsPopup} storage={storage} hiddenLanguages={hiddenLanguages} hiddenLanguagesDispatch={hiddenLanguagesDispatch} />
            <GameContainer game={game} clues={clues} storage={storage} hiddenLanguages={hiddenLanguages} updateStreak={updateStreak} />
        </main>
    </> );
}