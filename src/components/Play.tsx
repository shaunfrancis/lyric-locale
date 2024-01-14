import styles from '../app/page.module.css';

export default function Play(props){

    return (
        <div id={styles["play-container"]}>
            <div id={styles["guess-container"]}>
                <input type="text" id={styles["guess-input"]} placeholder="Guess a song..." />
            </div>
            <button id={styles["skip-button"]} onClick={props.nextClue}>Skip</button>
        </div>
    )
}