import { MutableRefObject, useEffect, useRef } from 'react';
import styles from '../app/page.module.css';

export default function Countdown( { gameDay } : { gameDay : string } ){
    const valueRef = useRef(null) as MutableRefObject<HTMLSpanElement | null>;
    const preMidnight = useRef(true);

    const mod = (a : number, b : number) : number => { return ( (a % b) + b ) % b };

    useEffect(() => {
        let countdownRefresher : NodeJS.Timeout | undefined;
        const updateCountdown = () => {
            const now = new Date();
            const clock = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()];

            const secondsRemaining = mod(60 - clock[2], 60);
            const minutesRemaining = mod(60 - clock[1] - (secondsRemaining > 0 ? 1 : 0), 60);
            const hoursRemaining = 24 - clock[0] - (minutesRemaining > 0 || secondsRemaining > 0 ? 1 : 0);
            const countdown = [hoursRemaining, minutesRemaining, secondsRemaining];

            if(gameDay != now.toISOString().split("T")[0]){
                preMidnight.current = false;
                clearInterval(countdownRefresher);
            }

            if(valueRef.current) valueRef.current!.innerHTML = countdown.map( v => v.toString().padStart(2,"0") ).join(":");
        }
        updateCountdown();
        countdownRefresher = setInterval(updateCountdown, 500);
    }, []);

    return (preMidnight.current ? 
        <div id={styles["countdown-container"]}>Next LyricLocale in <span id={styles["countdown-value"]} ref={valueRef}>24:00:00</span></div>
        : <div id={styles["countdown-container"]}>Refresh for a new LyricLocale</div>
    )
}