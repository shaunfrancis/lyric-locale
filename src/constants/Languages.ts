import Language from "@/types/Language";

const Languages : Language[] = [
    {
        code: "cs",
        enName: "Czech",
        localName: "Čeština",
        ratio: 2 / 3,
        squareSrc: "cs-sq"
    },
    {
        code: "cy",
        enName: "Welsh",
        localName: "Cymraeg",
        ratio: 3 / 5,
        squareSrc: "cy-sq"
    },
    {
        code: "da",
        enName: "Danish",
        localName: "Dansk",
        ratio: 28 / 37,
        squareSrc: "da-sq"
    },
    {
        code: "de",
        enName: "German",
        localName: "Deutsch",
        ratio: 3 / 5
    },
    {
        code: "es",
        enName: "Spanish",
        localName: "Español",
        ratio: 2 / 3,
        squareSrc: "es-sq"
    },
    {
        code: "fi",
        enName: "Finnish",
        localName: "Suomi",
        ratio: 11 / 18,
        squareSrc: "fi-sq"
    },
    {
        code: "fr",
        enName: "French",
        localName: "Français",
        ratio: 2 / 3
    },
    {
        code: "ga",
        enName: "Irish",
        localName: "Gaeilge",
        ratio: 1 / 2
    },
    {
        code: "gd",
        enName: "Scots Gaelic",
        localName: "Gàidhlig",
        ratio: 3 / 5,
        squareSrc: "gd-sq"
    },
    {
        code: "hu",
        enName: "Hungarian",
        localName: "Magyar",
        ratio: 1 / 2
    },
    {
        code: "is",
        enName: "Icelandic",
        localName: "Íslenska",
        ratio: 18 / 25,
        squareSrc: "is-sq"
    },
    {
        code: "it",
        enName: "Italian",
        localName: "Italiano",
        ratio: 2 / 3
    },
    {
        code: "lb",
        enName: "Luxembourgish",
        localName: "Lëtzebuergesch",
        ratio: 3 / 5
    },
    {
        code: "mt",
        enName: "Maltese",
        localName: "Malti",
        ratio: 2 / 3,
        squareSrc: "mt-sq"
    },
    {
        code: "nl",
        enName: "Dutch",
        localName: "Nederlands",
        ratio: 2 / 3
    },
    {
        code: "no",
        enName: "Norwegian",
        localName: "Norsk",
        ratio: 8 / 11,
        squareSrc: "no-sq"
    },
    {
        code: "pl",
        enName: "Polish",
        localName: "Polski",
        ratio: 5 / 8
    },
    {
        code: "pt",
        enName: "Portuguese",
        localName: "Português",
        ratio: 2 / 3,
        squareSrc: "pt-sq"
    },
    {
        code: "sv",
        enName: "Swedish",
        localName: "Svenska",
        ratio: 5 / 8,
        squareSrc: "sv-sq"
    }
];

const EnglishLanguage : Language = {
    code: "en",
    enName: "English",
    localName: "English",
    ratio: 1 / 2
};

const DefaultLanguage : Language = {
    code: "missing",
    enName: "Missing Data",
    localName: "Missing Data",
    ratio: 1
};

export { Languages, EnglishLanguage, DefaultLanguage };