import styles from '../app/page.module.css';
import { useRef, Dispatch, SetStateAction, MutableRefObject } from 'react';

export default function QueryInput( 
    {setResults, setInputIsFocused} : {setResults : Dispatch<SetStateAction<any>>, setInputIsFocused : Dispatch<SetStateAction<boolean>>} 
){

    let awaitingSearchTimeout : MutableRefObject<NodeJS.Timeout | undefined> = useRef();
    let awaitingQuery : MutableRefObject<string> = useRef("");
    const search = async (query : string) => {
        query = query.trim().toLowerCase();
        
        if(query == awaitingQuery.current) return;

        if(query == ""){
            clearTimeout(awaitingSearchTimeout.current);
            setResults([]);
            return;
        }

        awaitingQuery.current = query;

        awaitingSearchTimeout.current = setTimeout( async () => {
            if(query != awaitingQuery.current) return;

            const res = await fetch("http://localhost:3000/api/tracks?query=" + query);
            const json = await res.json();
            setResults(json);

        }, 1000);
    }

    return (
        <div id={styles["guess-input-container"]}>
            <input type="text" id={styles["guess-input"]} placeholder="Guess a song..." onChange={e => search(e.target.value)} autoComplete="false" spellCheck="false" onFocus={() => { setInputIsFocused(true) }} onBlur={() => { setInputIsFocused(false) }} />
            <div id={styles["guess-input-action"]}></div>
        </div>
    )
}