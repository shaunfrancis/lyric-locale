import { Dispatch, MutableRefObject, useEffect, useRef } from "react";
import Popup from "./Popup";

export default function StatsContainer(
    {statsPopup, streak, bestStreak} : 
    {statsPopup : MutableRefObject<HTMLDivElement | null>, streak : number, bestStreak : number}
){

    const streakComments = ["C'est la vie...", "Que será, será", "Molto bene", "Très bien !"];
    const bestStreakComments = ["Nul points", "Bon courage !", "Fantastisch", "¡Muy bien!"];

    return (
        <Popup popupRef={statsPopup}>
            <h1>
                <img src="/streak.svg" alt="" style={{height:"35px"}}/>
                <span>Streak</span>
            </h1>
            <div className="two-column">
                <div className="column">
                    <h2>Current Streak</h2>
                    <div className="streak-score">{streak}</div>
                    <p>{streakComments[Math.min(streakComments.length - 1, streak)]}</p>
                </div>
                <div className="column">
                    <h2>Best Streak</h2>
                    <div className="streak-score">{Math.max(streak, bestStreak)}</div>
                    <p>{bestStreakComments[Math.min(bestStreakComments.length - 1, Math.max(streak, bestStreak))]}</p>
                </div>
            </div>
        </Popup>
    )
}