import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import styles from '../app/page.module.css';
import { useRef, Dispatch, SetStateAction, MutableRefObject } from 'react';
import Song from '@/types/Song';
import { Game } from '@/types/Game';

export default function QueryInput( 
    {guessInputRef, setResults, setInputIsFocused, inputIndicator, setInputIndicator, selectSong, selectedSong, game, gameOver} : 
    {
        guessInputRef :  MutableRefObject<HTMLInputElement | null>,
        setResults : Dispatch<SetStateAction<Array<Song> | null>>, 
        setInputIsFocused : Dispatch<SetStateAction<boolean>>, 
        inputIndicator : GuessInputIndicatorClass, 
        setInputIndicator : Dispatch<SetStateAction<GuessInputIndicatorClass>>,
        selectSong : (song: Song | null) => void,
        selectedSong : Song | null,
        game: Game,
        gameOver : boolean
    } 
){

    let awaitingSearchTimeout : MutableRefObject<NodeJS.Timeout | undefined> = useRef();
    let awaitingQuery : MutableRefObject<string> = useRef("");

    const search = async (query : string) => {
        query = query.trim().toLowerCase();
        
        if(query == awaitingQuery.current) return;

        selectSong(null);
        setResults(null);

        if(query == "" || query.length <= 3){
            clearTimeout(awaitingSearchTimeout.current);
            awaitingQuery.current = query;
            setInputIndicator(GuessInputIndicatorClass.Static);
            return;
        }

        setInputIndicator(GuessInputIndicatorClass.Searching);

        awaitingQuery.current = query;

        awaitingSearchTimeout.current = setTimeout( async () => {
            if(query != awaitingQuery.current) return;
            
            const res = await fetch("/api/tracks?query=" + query);
            const json = await res.json() as Song[];

            if(json.find( s => s.id == game.song_id) ){ //prevent songs with identical names (i.e. probably covers) if solution is present
                const songs : Song[] = [];
                json.forEach( returnedData => {
                    const s : Song = {id: returnedData.id, title: returnedData.title, thumb: returnedData.thumb};
                    if(s.id == game.song_id) songs.push(s);
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

    const focusOnInput = () => {
        setInputIsFocused(true);
        if(selectedSong && guessInputRef.current) guessInputRef.current.select();
    }

    return (
        <div id={styles["guess-input-container"]}>
            <input ref={guessInputRef} type="text" id={styles["guess-input"]} title="Guess a song" placeholder="Guess the song..." onChange={e => search(e.target.value)} onFocus={focusOnInput} onBlur={() => { setInputIsFocused(false) }} autoComplete="false" spellCheck="false" tabIndex={1} disabled={gameOver} />
            <div className={styles[inputIndicator]} id={styles["guess-input-indicator"]}></div>
        </div>
    )
}