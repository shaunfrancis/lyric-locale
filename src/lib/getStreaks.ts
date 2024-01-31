import StoredData from "@/types/StoredData";

export default function getStreaks(startingId: number, storage: StoredData){

    //get current streak
    let initialStreak = 0, currentId = startingId;
    const todaysStat = storage.stats.find(s => s.id == startingId);
    if(!todaysStat || (todaysStat.won == 0 && todaysStat.count < 6)){ //today's game not yet completed
        initialStreak = 0; currentId--;
    }
    else if(todaysStat.won == 1){ //today's game won
        initialStreak = 1; currentId--;
    }
    else if(todaysStat.won == 0 && todaysStat.count == 6){ //streak lost today
        currentId = -1;
    }
    while( storage.stats.find(s => s.id == currentId) && storage.stats.find(s => s.id == currentId)!.won == 1 ){
        initialStreak++; currentId--;
    }

    //get best streak
    let bestStreak = 0, currentStreak = 0;
    if(storage.stats.length > 0){
        currentId = storage.stats[0].id;
        while(storage.stats.find( s => s.id <= currentId )){
            if(storage.stats.find( s => s.id == currentId && s.won == 1)) currentStreak++;
            else currentStreak = 0;

            if(currentStreak > bestStreak) bestStreak = currentStreak;
            currentId--;
        }
    }

    return {initialStreak: initialStreak, bestStreak: bestStreak};
}