export default async function uploadScore(id: number, startTime: number, score: number){
    const secondsElapsed = Math.round( (Date.now() - startTime) / 1000 );
    await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {id: id, elapsed: secondsElapsed, score: score} )
    });
}