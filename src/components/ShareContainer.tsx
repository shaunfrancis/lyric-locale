import styles from '../app/page.module.css';

export default function ShareContainer( {gameOver} : {gameOver : boolean} ){

    return (
        <div id={styles["share-container"]}>
            <div className={styles["share-button"]}>
                <img src="/copy.svg" alt="Copy"/>
                <span>Copy</span>
            </div>
            <div className={styles["share-button"]}>
                <img src="/x-logo.svg" alt="Tweet"/>
                <span>Tweet</span>
            </div>
        </div>
    )
}