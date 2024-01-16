import { GuessInputIndicatorClass } from '@/constants/GuessInputIndicatorClass';
import styles from '../app/page.module.css';
import { Dispatch, SetStateAction } from 'react';

export default function QueryResults( 
    { results, inputIsFocused } : { results : Array<any> | null, inputIsFocused : boolean } 
){

    if(Array.isArray(results)){
        return (
            <div id={styles["query-results"]} className={inputIsFocused ? styles["visible"] : ""}>
                {
                    results.length > 0 ?
                    results.map( (result : any, index : number) => {
                        return (
                            <div key={index} className={styles["query-result"]}>
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