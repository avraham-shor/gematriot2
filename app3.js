const FS = require('fs');
const axios = require('axios');
BASE_URL = "https://www.sefaria.org/api/texts/";
PARAMS = "?ven=The_Contemporary_Torah,_Jewish_Publication_Society,_2006&vhe=Miqra_according_to_the_Masorah&lang=he&aliyot=0";
const CHUMASHIM = [
    { 'Genesis.': 50 }, { 'shmot.': 40 }, { 'Leviticus.': 27 }, { 'bamidbar.': 36 }, { 'dvarim.': 34 }
];
const NEVIHIM = [
    { 'Joshua.': 24 }, { 'Judges.': 21 }
    , { 'I Samuel.': 31 }, { 'II Samuel.': 24 },{ 'I Kings.': 22 }, { 'II Kings.': 25 },
     { 'Isaiah.': 66 }, { 'Jeremiah.': 52 }, { 'Ezekiel.': 48 }, { 'Hosea.': 14 }, { 'Amos.': 9 }, { 'Jonah.': 4 },
     { 'Micah.': 7 }, { 'Nahum.': 3 }, { 'Habakkuk.': 3 }, { 'Zephaniah.': 3 }, { 'Haggai.': 2 }, { 'Zechariah.': 14 },
     { 'Malachi.': 3 }, { 'Joel.': 4 }, { 'Obadiah.': 1 }
];
const CETUVIM = [
    { 'Psalms.': 150 }, { 'Proverbs.': 31 }, { 'Song of Songs.': 8 },
 { 'Lamentations.': 5 }, { 'Ecclesiastes.': 12 }, { 'Esther.': 10 }, { 'Daniel.': 12 }, { 'Nehemiah.': 13 }, { 'I Chronicles.': 29 },
 { 'II Chronicles.': 36 }, { 'Job.': 42 }, { 'Ruth.': 4 }, { 'Ezra.': 10 }
];
const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

let perekLength = 20;

let nameOfFile = "gem-tora.js";

let nameOfObject = "const gemTora = ";

let SFARIM = CHUMASHIM;



Object.keys(VAL).forEach(function (key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
});

let gemOfTorah = {};
const arrayOfObjects = [];
// getChumashimAndPrintFile(0, 0);

main();

function main() {
    //1. Tora, 2. Nevihim, 3. Cetuvim
    setSfarim(3);
    getChumashimAndPrintFile(0);
    gemOfTorah = {};

}

function setSfarim(type) {
    switch (type) {
        case 1:
            nameOfFile = `gem-tora.js`;
            nameOfObject = "const gemTora = ";
            SFARIM = CHUMASHIM;
            break;
        case 2:
            nameOfFile = "gem-nevihim.js";
            nameOfObject = "const gemNevihim = ";
            SFARIM = NEVIHIM;
            break;
        case 3:
            nameOfFile = "gem-cetuvim.js";
            nameOfObject = "const gemCetuvim = ";
            SFARIM = CETUVIM;
            break;
        default:
            break;
    }
}

//https://www.sefaria.org/api/texts/Psalms.1?ven=The_Contemporary_Torah,_Jewish_Publication_Society,_2006&vhe=Miqra_according_to_the_Masorah&lang=he&aliyot=0

function writeAFile() {
    const ObjectJson = JSON.stringify(gemOfTorah);
    FS.writeFileSync(nameOfFile, nameOfObject + ObjectJson);
}


function getChumashimAndPrintFile(index) {
    if (index >= SFARIM.length) {
        setTimeout(() => {
            writeAFile()
        }, 22000);
        return;
    }
    const chumash = SFARIM[index];
    console.log('chumash', chumash);
    const CHUMASH = Object.keys(chumash)[0];
    const range = chumash[CHUMASH];
    for (let i = 0; i <= range; i++) {
        axios.get(BASE_URL + CHUMASH + i + PARAMS).then(resp => {
            setTimeout(() => {
                setTora(gemOfTorah, resp.data);
            }, perekLength * 100);
        });
    }
    setTimeout(() => {
        getChumashimAndPrintFile(index + 1)
    }, 5000 * range);
}





function setTora(gemOfTorah, perek) {
    if (perek.he) {
        perekLength = perek.he.length * 20;
        perek.he = perek.he.map((pasuk) => {
            //console.log(pasuk);
            return clean(pasuk);
          });
         const perekSource = perek.heRef.replace("שמואל ", "שמואל-").replace("מלכים ", "מלכים-").replace("דברי הימים ", "דברי-הימים-").replace("שיר השירים", "שיר-השירים");
         const perekSourceSplit = perekSource.split(" ");
        const chumash = perekSourceSplit[0];
        const perekChar = perekSourceSplit[1];
        //console.log(perekChar);
        const perekNumber = getPerekNumber(perekChar);
        if (!gemOfTorah[chumash]) {
            gemOfTorah[chumash] = [];
        }
        gemOfTorah[chumash][perekNumber] = perek.he;
        //console.log(chumash, perekNumber, gemOfTorah[chumash][perekNumber]);
    }
}


function clean(word) {
    //console.log(word);
    if (typeof word == typeof "") {
        const twoOrMoreSpaces = /\s+/g;
        const betweenTwoHalfBrackets = /\([^)]*\)|\[[^\]]*\]/g;
        return word.replaceAll(/[a-z]|[0-9]|<|>|-|"|=|/g, "").replaceAll("{ס}", "").replaceAll("{פ}", "")
        .replace(betweenTwoHalfBrackets, "").replaceAll("/", "").replaceAll("|", "").replaceAll("*", "").replaceAll(twoOrMoreSpaces, " ");
    }
}

function getPerekNumber(perek) {
    perek = perek.replace('״','').replace("׳", "");
    //console.log(perek);
    const num = perek.split("").map(char => VAL[char]).reduce((a,b) => a+b);
    //console.log(num - 1);
    return num -1;
}

// function inRange(gematria, min) {
//     let max = min + 300;
//     nameOfFile = "gematriot-tora-" + min + "-" + max + ".js";
//     nameOfObject = "const tora_" + min + "_" + max + " = ";
//     // console.log(gematria, min, max, gematria >= min && gematria < max);
//     return gematria >= min && gematria < max;
// }

function switchObject(result) {
    for (let i = 1; i < 2000; i = i + 100) {
        if (result < i) {
            return arrayOfObjects[i];
        }

    }
}


