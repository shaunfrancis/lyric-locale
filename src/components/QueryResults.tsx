import { GuessInputIndicatorClass } from '@/types/GuessInputIndicatorClass';
import styles from '../app/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import Song from '@/types/Song';

export default function QueryResults( 
    { results, inputIsFocused, selectSong } : 
    { results : Song[] | null, inputIsFocused : boolean, selectSong : (song : Song | null) => void } 
){

    if(Array.isArray(results)){
        return (
            <div id={styles["query-results"]} className={inputIsFocused ? styles["visible"] : ""}>
                {
                    results.length > 0 ?
                    results.map( (result : Song, index : number) => {
                        return (
                            <div key={index} className={styles["query-result"]} onMouseDown={e => e.preventDefault()} onClick={() => selectSong(result)}>
                                <img src={result.thumb} alt={result.title + " thumbnail"} />
                                <span>{result.title}</span>
                            </div>
                        )
                    })
                    :
                    (
                        <div id={styles["no-results"]} className={styles["query-result"]}>
                            <span>No results found!</span>
                        </div>
                    )
                }
            </div>
        )
    }
}