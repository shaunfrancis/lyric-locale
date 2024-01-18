import { RowDataPacket } from 'mysql2'

export interface Game extends RowDataPacket{
    id: number,
    solution_id: number,
    title: string,
    lyrics: string,
    thumb: string
}