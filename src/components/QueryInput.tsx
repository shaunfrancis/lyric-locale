import { GuessInputIndicatorClass } from '@/constants/GuessInputIndicatorClass';
import styles from '../app/page.module.css';
import { useRef, Dispatch, SetStateAction, MutableRefObject } from 'react';

export default function QueryInput( 
    {setResults, setInputIsFocused, inputIndicator, setInputIndicator} : {setResults : Dispatch<SetStateAction<any>>, setInputIsFocused : Dispatch<SetStateAction<boolean>>, inputIndicator : GuessInputIndicatorClass, setInputIndicator : Dispatch<SetStateAction<GuessInputIndicatorClass>>} 
){

    let awaitingSearchTimeout : MutableRefObject<NodeJS.Timeout | undefined> = useRef();
    let awaitingQuery : MutableRefObject<string> = useRef("");
    const search = async (query : string) => {
        query = query.trim().toLowerCase();
        
        if(query == awaitingQuery.current) return;

        if(query == "" || query.length <= 3){
            clearTimeout(awaitingSearchTimeout.current);
            setResults([]);
            awaitingQuery.current = query;
            setInputIndicator(GuessInputIndicatorClass.Static);
            return;
        }

        setInputIndicator(GuessInputIndicatorClass.Searching);
        setResults([]);

        awaitingQuery.current = query;

        awaitingSearchTimeout.current = setTimeout( async () => {
            if(query != awaitingQuery.current) return;

            const res = await fetch("/api/tracks?query=" + query);
            const json = await res.json();
            setResults(json);
            setInputIndicator(GuessInputIndicatorClass.Static);

        }, 1000);
    }

    return (
        <div id={styles["guess-input-container"]}>
            <input type="text" id={styles["guess-input"]} placeholder="Guess a song..." onChange={e => search(e.target.value)} onFocus={() => { setInputIsFocused(true) }} onBlur={() => { setInputIsFocused(false) }} autoComplete="false" spellCheck="false"  />
            <div className={styles[inputIndicator]} id={styles["guess-input-indicator"]}></div>
        </div>
    )
}