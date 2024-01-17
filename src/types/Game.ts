import { RowDataPacket } from 'mysql2'

export interface Game extends RowDataPacket{
    id: number,
    solution_id: number,
    lyrics: string
}