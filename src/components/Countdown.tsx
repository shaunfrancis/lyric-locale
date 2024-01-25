import { MutableRefObject, useEffect, useRef } from 'react';
import styles from '../app/page.module.css';

export default function Countdown(){
    const valueRef = useRef(null) as MutableRefObject<HTMLSpanElement | null>;

    const mod = (a : number, b : number) : number => { return ( (a % b) + b ) % b }
    const ukTime = (hour: number, minute: number, second: number) => {
        const offset = (new Date()).getTimezoneOffset();
        const offsetClock = [Math.floor(Math.abs(offset)/60), Math.abs(offset) % 60];
        const sgn = Math.sign(offset);

        hour = mod(hour - sgn*offsetClock[0], 24);
        minute = minute - sgn*offsetClock[1];
        if(minute < 0 || minute >= 60){
            minute = minute + sgn*60;
            hour = mod(hour - sgn*1, 24);
        }

        return [hour, minute, second];
    }

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const clock = ukTime(now.getHours(), now.getMinutes(), now.getSeconds());

            const secondsRemaining = mod(60 - clock[2], 60);
            const minutesRemaining = mod(60 - clock[1] - (secondsRemaining > 0 ? 1 : 0), 60);
            const hoursRemaining = 24 - clock[0] - (minutesRemaining > 0 || secondsRemaining > 0 ? 1 : 0);
            const countdown = [hoursRemaining, minutesRemaining, secondsRemaining];

            if(valueRef.current) valueRef.current!.innerHTML = countdown.map( v => v.toString().padStart(2,"0") ).join(":");
        }
        updateCountdown();
        setInterval(updateCountdown, 500);
    }, []);

    return (
        <div id={styles["countdown-container"]}>Next LyricLocale in <span id={styles["countdown-value"]} ref={valueRef}>24:00:00</span></div>
    )
}