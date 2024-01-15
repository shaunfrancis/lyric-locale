import styles from '../app/page.module.css';
import { Dispatch, SetStateAction } from 'react';

export default function QueryResults( 
    { results, inputIsFocused } : { results : any, inputIsFocused : boolean } 
){
    return (
        <div id={styles["query-results"]} className={inputIsFocused ? styles["visible"] : ""}>
            {
                results.map( (result : any, index : number) => {
                    return (
                        <div key={index} className={styles["query-result"]}>
                            <img src={result.thumb} alt={result.title + " thumbnail"} />
                            <span>{result.title}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}