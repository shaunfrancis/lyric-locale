import { Profanity } from '@/constants/Profanity';

export default function explicitText(text : string) : boolean {
    console.log(Profanity);
    return Profanity.some( (expletive) => { return text.toLowerCase().includes(expletive) } );
}