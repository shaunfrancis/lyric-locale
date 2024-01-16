import { RowDataPacket } from 'mysql2'
import Language from './Language'

export default interface Clue extends ClueWithoutLanguage{
    id: boolean,
    game_id: boolean,
    level: boolean,
    lyrics: string,
    language: Language
}

export interface ClueWithoutLanguage extends RowDataPacket{
    id: boolean,
    game_id: boolean,
    level: boolean,
    lyrics: string,
}