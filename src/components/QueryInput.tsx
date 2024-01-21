import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import styles from '../app/page.module.css';
import { useRef, Dispatch, SetStateAction, MutableRefObject } from 'react';
import Song from '@/types/Song';
import { Game } from '@/types/Game';

export default function QueryInput( 
    {guessInputRef, setResults, setInputIsFocused, inputIndicator, setInputIndicator, selectSong, game} : 
    {
        guessInputRef :  MutableRefObject<HTMLInputElement | null>,
        setResults : Dispatch<SetStateAction<Array<Song> | null>>, 
        setInputIsFocused : Dispatch<SetStateAction<boolean>>, 
        inputIndicator : GuessInputIndicatorClass, 
        setInputIndicator : Dispatch<SetStateAction<GuessInputIndicatorClass>>,
        selectSong : (song: Song | null) => void,
        game: Game
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
            const json = await res.json() as Song[];

            if(json.find( s => s.id == game.solution_id) ){ //prevent songs with identical names (i.e. probably covers) if solution is present
                const songs : Song[] = [];
                json.forEach( s => {
                    if(s.id == game.solution_id) songs.push(s);
                    else{
                        const title = game.title.split(" - ")[1];
                        if(!title || !(s.title.toLowerCase().includes(title.toLowerCase()))) songs.push(s);
                    }
                });
                setResults(songs);
            }
            else setResults(json);
            
            setInputIndicator(GuessInputIndicatorClass.Static);

        }, 1000);
    }

    return (
        <div id={styles["guess-input-container"]}>
            <input ref={guessInputRef} type="text" id={styles["guess-input"]} placeholder="Guess the song..." onChange={e => search(e.target.value)} onFocus={() => { setInputIsFocused(true) }} onBlur={() => { setInputIsFocused(false) }} autoComplete="false" spellCheck="false"  />
            <div className={styles[inputIndicator]} id={styles["guess-input-indicator"]}></div>
        </div>
    )
}