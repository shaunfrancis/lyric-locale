"use client";

import Clue from "@/types/Clue";
import { Game } from "@/types/Game";
import HelpContainer from "./HelpContainer";
import GameContainer from "./GameContainer";
import Header from "./Header";
import { useRef } from "react";

export default function ClientHomeContainer( {game, clues} : {game: Game, clues: Clue[]} ){
    const helpPopup = useRef<HTMLDivElement | null>(null);

    return( <>
        <Header game={game} helpPopup={helpPopup} />
        <main>
            <HelpContainer helpPopup={helpPopup} />
            <GameContainer game={game} clues={clues} />
        </main>
    </> );
}