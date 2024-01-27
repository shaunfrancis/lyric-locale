import { Profanity } from '@/constants/Profanity';

export default function explicitText(text : string) : boolean {
    return Profanity.some( (expletive) => { return text.toLowerCase().includes(expletive) } );
}