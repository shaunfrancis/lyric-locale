import getGame from '../lib/getGame';
import getClues from '../lib/getClues';
import ClientHomeContainer from '@/components/ClientHomeContainer';

export default async function Home() {
    const game = await getGame();
    const clues = await getClues(game.id);

    return ( <ClientHomeContainer game={game} clues={clues} /> );
}