import { RowDataPacket } from 'mysql2'

export default interface Clue extends RowDataPacket{
    id: boolean,
    game_id: boolean,
    level: boolean,
    language: string,
    lyrics: string
}