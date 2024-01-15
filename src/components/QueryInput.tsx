import styles from '../app/page.module.css';
import { Dispatch, SetStateAction } from 'react';

export default function QueryInput( 
    {setResults, setInputIsFocused} : {setResults : Dispatch<SetStateAction<any>>, setInputIsFocused : Dispatch<SetStateAction<boolean>>} 
){

    console.log(process.env);
    const search = async (query : string) => {
        if(query == ""){
            setResults([]);
            return;
        }
        const goFetch = await fetch(process.env.TRACK_SEARCH_URL + "&type=master&format=single&q=" + query);
        const json = await goFetch.json();

        setResults(json.results);
    }

    return (
        <div id={styles["guess-input-container"]}>
            <input type="text" id={styles["guess-input"]} placeholder="Guess a song..." onChange={e => search(e.target.value)} autoComplete="false" spellCheck="false" onFocus={() => { setInputIsFocused(true) }} onBlur={() => { setInputIsFocused(false) }} />
            <div id={styles["guess-input-action"]}></div>
        </div>
    )
}