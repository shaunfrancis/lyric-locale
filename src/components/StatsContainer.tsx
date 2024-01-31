import { Dispatch, MutableRefObject, useEffect, useRef } from "react";
import Popup from "./Popup";
import Language from "@/types/Language";
import { Languages } from "@/constants/Languages";
import StoredData from "@/types/StoredData";

export default function StatsContainer(
    {statsPopup, streak, bestStreak} : 
    {statsPopup : MutableRefObject<HTMLDivElement | null>, streak : number, bestStreak : number}
){
    return (
        <Popup popupRef={statsPopup}>
            <h1>
                <img src="/streak.svg" alt="" style={{height:"35px"}}/>
                <span>Streak</span>
            </h1>
            <p>Your current daily success streak is {streak}.</p>
            <p>Your best daily success streak is {Math.max(streak, bestStreak)}.</p>
        </Popup>
    )
}