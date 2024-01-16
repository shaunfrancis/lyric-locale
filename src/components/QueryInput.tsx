import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import styles from '../app/page.module.css';
import { useRef, Dispatch, SetStateAction, MutableRefObject } from 'react';
import SongResult from '@/types/SongResult';

export default function QueryInput( 
    {guessInputRef, setResults, setInputIsFocused, inputIndicator, setInputIndicator, selectSong} : 
    {
        guessInputRef :  MutableRefObject<HTMLInputElement | null>,
        setResults : Dispatch<SetStateAction<Array<SongResult> | null>>, 
        setInputIsFocused : Dispatch<SetStateAction<boolean>>, 
        inputIndicator : GuessInputIndicatorClass, 
        setInputIndicator : Dispatch<SetStateAction<GuessInputIndicatorClass>>,
        selectSong : (song: SongResult | null) => void
    } 
){

    let awaitingSearchTimeout : MutableRefObject<NodeJS.Timeout | undefined> = useRef();
    let awaitingQuery : MutableRefObject<string> = useRef("");
    const search = async (query : string) => {
        query = query.trim().toLowerCase();
        
        if(query == awaitingQuery.current) return;

        if(query == "" || query.length <= 3){
            clearTimeout(awaitingSearchTimeout.current);
            setResults(null);
            awaitingQuery.current = query;
            setInputIndicator(GuessInputIndicatorClass.Static);
            return;
        }
        
        selectSong(null);
        setInputIndicator(GuessInputIndicatorClass.Searching);
        setResults(null);

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
            <input ref={guessInputRef} type="text" id={styles["guess-input"]} placeholder="Guess a song..." onChange={e => search(e.target.value)} onFocus={() => { setInputIsFocused(true) }} onBlur={() => { setInputIsFocused(false) }} autoComplete="false" spellCheck="false"  />
            <div className={styles[inputIndicator]} id={styles["guess-input-indicator"]}></div>
        </div>
    )
}