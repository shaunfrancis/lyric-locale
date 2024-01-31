export default async function uploadScore(id: number, score: number){
    await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {id: id, score: score} )
    });
}