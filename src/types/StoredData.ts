import Language from "./Language";
import Stat from "./Stat";

type StoredData = {
    stats : Stat[],
    settings: {
        hide : string[]
    }
}

export default StoredData;