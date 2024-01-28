import Language from "@/types/Language";

const Languages : Language[] = [
    {
        code: "az",
        flag: "🇦🇿",
        enName: "Azerbaijani",
        localName: "Azərbaycanca",
        ratio: 1 / 2,
        squareSrc: "az-sq",
        difficulty: 1
    },
    {
        code: "cs",
        flag: "🇨🇿",
        enName: "Czech",
        localName: "Čeština",
        ratio: 2 / 3,
        squareSrc: "cs-sq",
        difficulty: 1
    },
    {
        code: "cy",
        flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
        enName: "Welsh",
        localName: "Cymraeg",
        ratio: 3 / 5,
        squareSrc: "cy-sq",
        difficulty: 1
    },
    {
        code: "da",
        flag: "🇩🇰",
        enName: "Danish",
        localName: "Dansk",
        ratio: 28 / 37,
        squareSrc: "da-sq"
    },
    {
        code: "de",
        flag: "🇩🇪",
        enName: "German",
        localName: "Deutsch",
        ratio: 3 / 5
    },
    {
        code: "es",
        flag: "🇪🇸",
        enName: "Spanish",
        localName: "Español",
        ratio: 2 / 3,
        squareSrc: "es-sq"
    },
    {
        code: "fi",
        flag: "🇫🇮",
        enName: "Finnish",
        localName: "Suomi",
        ratio: 11 / 18,
        squareSrc: "fi-sq",
        difficulty: 1
    },
    {
        code: "fr",
        flag: "🇫🇷",
        enName: "French",
        localName: "Français",
        ratio: 2 / 3
    },
    {
        code: "ga",
        flag: "🇮🇪",
        enName: "Irish",
        localName: "Gaeilge",
        ratio: 1 / 2,
        difficulty: 1
    },
    {
        code: "gd",
        flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        enName: "Scots Gaelic",
        localName: "Gàidhlig",
        ratio: 3 / 5,
        squareSrc: "gd-sq",
        difficulty: 1
    },
    {
        code: "hu",
        flag: "🇭🇺",
        enName: "Hungarian",
        localName: "Magyar",
        ratio: 1 / 2,
        difficulty: 1
    },
    {
        code: "is",
        flag: "🇮🇸",
        enName: "Icelandic",
        localName: "Íslenska",
        ratio: 18 / 25,
        squareSrc: "is-sq"
    },
    {
        code: "it",
        flag: "🇮🇹",
        enName: "Italian",
        localName: "Italiano",
        ratio: 2 / 3
    },
    {
        code: "lb",
        flag: "🇱🇺",
        enName: "Luxembourgish",
        localName: "Lëtzebuergesch",
        ratio: 3 / 5
    },
    {
        code: "mt",
        flag: "🇲🇹",
        enName: "Maltese",
        localName: "Malti",
        ratio: 2 / 3,
        squareSrc: "mt-sq",
        difficulty: 1
    },
    {
        code: "nl",
        flag: "🇳🇱",
        enName: "Dutch",
        localName: "Nederlands",
        ratio: 2 / 3
    },
    {
        code: "no",
        flag: "🇳🇴",
        enName: "Norwegian",
        localName: "Norsk",
        ratio: 8 / 11,
        squareSrc: "no-sq"
    },
    {
        code: "pl",
        flag: "🇵🇱",
        enName: "Polish",
        localName: "Polski",
        ratio: 5 / 8,
        difficulty: 1
    },
    {
        code: "pt",
        flag: "🇵🇹",
        enName: "Portuguese",
        localName: "Português",
        ratio: 2 / 3,
        squareSrc: "pt-sq"
    },
    {
        code: "ro",
        flag: "🇷🇴",
        enName: "Romanian",
        localName: "Română",
        ratio: 2 / 3,
        difficulty: 1
    },
    {
        code: "sq",
        flag: "🇦🇱",
        enName: "Albanian",
        localName: "Shqip",
        ratio: 5 / 7,
        squareSrc: "sq-sq",
        difficulty: 1
    },
    {
        code: "sv",
        flag: "🇸🇪",
        enName: "Swedish",
        localName: "Svenska",
        ratio: 5 / 8,
        squareSrc: "sv-sq"
    },
    {
        code: "tr",
        flag: "🇹🇷",
        enName: "Turkish",
        localName: "Türkçe",
        ratio: 2 / 3,
        squareSrc: "tr-sq",
        difficulty: 1
    }
];

const EnglishLanguage : Language = {
    code: "en",
    flag: "🇬🇧",
    enName: "English",
    localName: "English",
    ratio: 1 / 2
};

const DefaultLanguage : Language = {
    code: "missing",
    flag: "🌐",
    enName: "Missing Data",
    localName: "Missing Data",
    ratio: 1
};

export { Languages, EnglishLanguage, DefaultLanguage };