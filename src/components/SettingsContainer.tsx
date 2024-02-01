import { Dispatch, MutableRefObject, useEffect, useRef } from "react";
import Popup from "./Popup";
import Language from "@/types/Language";
import { Languages } from "@/constants/Languages";
import StoredData from "@/types/StoredData";

export default function SettingsContainer(
    {settingsPopup, storage, hiddenLanguages, hiddenLanguagesDispatch} : 
    {settingsPopup : MutableRefObject<HTMLDivElement | null>, storage: StoredData, hiddenLanguages: Language[], hiddenLanguagesDispatch: Dispatch<{type: string, value: string}>}
){
    
    let init = useRef(true);
    useEffect( () => {
        if(init.current){ //do not run on first render, localStorage was not defined
            init.current = false;
            return;
        }
        localStorage.setItem( "settings", JSON.stringify({...storage.settings, hide: hiddenLanguages.map(l => l.code)}) );
    }, [hiddenLanguages]);

    return (
        <Popup popupRef={settingsPopup}>
            <h1>
                <img src="/settings.svg" alt="" style={{height:"35px"}}/>
                <span>Settings</span>
            </h1>
            <h2>Hide Languages</h2>
            <p>If you speak other languages and don't want to spoil the game, you can choose to hide them. You can unhide them at any time while playing.</p>
            <div id="language-selector-container">
            {
                Languages.sort((a,b) => a.enName.localeCompare(b.enName)).map( (lang, index) => {
                    const isSelected = hiddenLanguages.find(l => l.code == lang.code);
                    return(
                        <button key={index} className={"language-selector" + (isSelected ? " selected" : "")} onClick={() => { hiddenLanguagesDispatch({type:"toggle", value:lang.code})}}>
                            <img src={"/" + ("squareSrc" in lang ? lang.squareSrc : lang.code) + ".png"} alt="" />
                            <span>{lang.enName}</span>    
                        </button>
                    )
                })
            }
            </div>
        </Popup>
    )
}