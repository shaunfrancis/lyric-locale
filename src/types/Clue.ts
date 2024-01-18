import { RowDataPacket } from 'mysql2'
import Language from './Language'

export default interface Clue{
    level: number,
    lyrics: string,
    language: Language
}

export interface ClueWithoutLanguage extends RowDataPacket{
    level: number,
    lyrics: string,
}