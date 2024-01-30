import { Languages } from "@/constants/Languages";
import Stat from "@/types/Stat";
import StoredData from "@/types/StoredData";

export default function parseLocalStorage() : StoredData{
    const storage : StoredData = { stats: [], settings: {hide: []}};

    [{key:"game-stats", default:[]}, {key:"settings", default:{}}].forEach( data => {
        if(!localStorage.getItem(data.key)) localStorage.setItem(data.key, JSON.stringify(data.default));
        else{
            try{
                const value = JSON.parse(localStorage.getItem(data.key)!);
                if(!value || !(Array.isArray(data.default) == Array.isArray(value)) || !(typeof data.default === typeof value)){
                    localStorage.setItem(data.key, JSON.stringify(data.default));
                }
            }
            catch(err){ localStorage.setItem(data.key, JSON.stringify(data.default)) }
        }
    });

    const stats = JSON.parse(localStorage.getItem("game-stats")!);
    stats.forEach( (stat : any) => {
        const isValidType = ["id","count","won"].every( k => k in stat && typeof stat[k] == "number" );
        if(typeof stat === "object" && isValidType) storage.stats.push(stat as Stat);
    });

    const settings = JSON.parse(localStorage.getItem("settings")!);
    if("hide" in settings && Array.isArray(settings.hide)) settings.hide.forEach( (code : any) => {
        if(typeof code !== "string") return;
        const lang = Languages.find( l => l.code == code );
        if(lang) storage.settings.hide.push(code);
    });

    return storage;
}