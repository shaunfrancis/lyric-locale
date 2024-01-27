export default function clean(title : string) : string {
    //weird spaces and apstrophes
    title = title.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ").replace(/’/g,"'");

    //asterisks after artists
    title = title.replace(/\* - /g, " - ");

    //bracketed numbers after artists
    title = title.replace(/\([0-9]*\) - /g, "- ");

    return title.replace(/  +/g, " ").toLowerCase();
}