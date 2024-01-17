import { RowDataPacket } from 'mysql2'
import Language from './Language'

export default interface Clue extends ClueWithoutLanguage{
    level: boolean,
    lyrics: string,
    language: Language
}

export interface ClueWithoutLanguage extends RowDataPacket{
    level: boolean,
    lyrics: string,
}