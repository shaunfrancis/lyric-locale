import { Dispatch, MutableRefObject, useEffect, useRef } from "react";
import Popup from "./Popup";
import Language from "@/types/Language";
import { Languages } from "@/constants/Languages";
import StoredData from "@/types/StoredData";

export default function SettingsContainer(
    {settingsPopup, storage, hiddenLanguages, hiddenLanguagesDispatch} : 
    {settingsPopup : MutableRefObject<HTMLDivElement | null>, storage: StoredData, hiddenLanguages: Language[], hiddenLanguagesDispatch: Dispatch<{type: string, value: string}>}
){
    
    useEffect( () => {
        storage.settings.hide = hiddenLanguages.map(l => l.code);
        localStorage.setItem("settings", JSON.stringify(storage.settings));
    }, [hiddenLanguages]);

    return (
        <Popup popupRef={settingsPopup}>
            <h1>Settings</h1>
            <h2>Hide Languages</h2>
            <p>If you speak other languages and don't want to spoil the game, you can choose to hide them. You can unhide them at any time while playing.</p>
            <div id="language-selector-container">
            {
                Languages.sort((a,b) => a.enName.localeCompare(b.enName)).map( lang => {
                    const isSelected = hiddenLanguages.find(l => l.code == lang.code);
                    return(
                        <button className={"language-selector" + (isSelected ? " selected" : "")} onClick={() => { hiddenLanguagesDispatch({type:"toggle", value:lang.code})}}>
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