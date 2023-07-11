const FS = require('fs');
const axios = require('axios');
BASE_URL = "https://www.sefaria.org/api/texts/";
PARAMS = "?ven=The_Contemporary_Torah,_Jewish_Publication_Society,_2006&vhe=Miqra_according_to_the_Masorah&lang=he&aliyot=0";
const CHUMASHIM = [{ 'Genesis.': 50 }, { 'shmot.': 40 }, { 'Leviticus.': 27 }, { 'bamidbar.': 36 }, { 'dvarim.': 34 }
];
const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

let perekLength = 20;

let nameOfFile = "gematriot-tora-200.json";

let nameOfObject;



Object.keys(VAL).forEach(function (key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
});

let gemOfTorah = {};
let sourceOfGems = {}
const arrayOfObjects = [];
// getChumashimAndPrintFile(0, 0);

main();

function main() {
    
    getChumashimAndPrintFile(0);
    gemOfTorah = {};
    let rawdata = FS.readFileSync('gemat.json');
    gemOfTorah = JSON.parse(rawdata);
    console.log("start");
    //console.log(gemOfTorah);
    // if (min < 14000) {
    //     setTimeout(() => {
    //         main(min + 2000)
    //     }, 100000);
    //     return;
    // }
}


// setTimeout(() => {
//     writeAFile()
// }, 200000);

// getTora(BASE_URL + CHUMASH + i + PARAMS).then(data => {
//     data.json().then(perek => {
//         setListOfNumbersInTora(gemOfTorah, perek);
//     })
// });

//https://www.sefaria.org/api/texts/I Chronicles.230?ven=The_Contemporary_Torah,_Jewish_Publication_Society,_2006&vhe=Miqra_according_to_the_Masorah&lang=he&aliyot=0

function writeAFile() {
    const ObjectJson = JSON.stringify(gemOfTorah);
    FS.writeFileSync(nameOfFile, nameOfObject + ObjectJson);
}

// for (let i = 0; i < CHUMASHIM.length; i++) {
//     const chumash = CHUMASHIM[i];
//     console.log(chumash);

//     console.log(CHUMASH);
//     // const range = chumash[CHUMASH]
//     // for (let i = 0; i <= range; i++) {
//     //     axios.get(BASE_URL + CHUMASH + i + PARAMS).then(resp => {
//     //         setListOfNumbersInTora(gemOfTorah, resp.data);
//     //     });
//     // }
// }

function getChumashimAndPrintFile(index) {
    if (index >= CHUMASHIM.length) {
        setTimeout(() => {
            writeAFile()
        }, 22000);
        return;
    }
    // const chumash = CHUMASHIM[index];
    // console.log('chumash', chumash);
    // const CHUMASH = Object.keys(chumash)[0];
    // const range = chumash[CHUMASH];


    for (const [k, v] of Object.entries(gemOfTorah)) {
        let source = k;
        let perek = v;
        setTimeout(() => {
            setListOfNumbersInTora(gemOfTorah, source, perek);
        }, perekLength);
    }

    // for (let i = 0; i <= range; i++) {
    //     axios.get(BASE_URL + CHUMASH + i + PARAMS).then(resp => {
    //         setTimeout(() => {
    //             setListOfNumbersInTora(gemOfTorah, resp.data, min);
    //         }, perekLength);
    //     });
    // }
    setTimeout(() => {
        getChumashimAndPrintFile(index + 1)
    }, 500 * 10);
}





function setListOfNumbersInTora(gemOfTorah, source, perek) {
        perekLength = perek.length * 22;
        perek.forEach((pasuk, index) => {
            // console.log(e, index);
            // console.log(1, pasuk);
            // console.log(2, pasuk);
            const sourcePasuk = addIndexPasuk(index + 1);
            wordsOfPasuk = pasuk.split(' ');
            for (let i = 0; i < wordsOfPasuk.length; i++) {
                for (let j = i + 1; j <= wordsOfPasuk.length; j++) {
                    let words = wordsOfPasuk.slice(i, j);
                    if (words.length) {
                        let word = words.join(' ');
                            let entirePasuk = pasuk.split(word);
                            const pasukWithSource = [entirePasuk[0], word, entirePasuk[1], perek.heRef + sourcePasuk];
                            const calculatedWord = calculate(word);
                            if (!gemOfTorah[calculatedWord]) {
                                gemOfTorah[calculatedWord] = [];
                            }
                            // console.log('word:', word, rejects(word) );
                            wordWithoutNikud = rejects(word);
                            //gemOfTorah[calculate(word)] = ;
                            if (!gemOfTorah[calculatedWord].filter(pasuk => rejects(pasuk[1]) == wordWithoutNikud).length) {
                                gemOfTorah[calculatedWord].push(pasukWithSource);
                                const sourcePerek = source;
                                const sourcePasuk = index;
                                const start = i;
                                const end = j;
                                addToTheSourceObj(calculatedWord ,sourcePerek, sourcePasuk, start, end);
                            }

                    }
                }
            }
        });
}

function addToTheSourceObj(value ,perek, pasuk, start, end) {
    const source = [perek, pasuk, start, end];
    if (!sourceOfGems[value]) {
        sourceOfGems[value] = [];
    }
    sourceOfGems[value].push(source);
    //testing
    const entirePasuk = gemOfTorah[perek][pasuk];
    const select = entirePasuk.split(" ").slice(start, end).join(" ");
    const parts = entirePasuk.split(select);
    if (value < 100) {
        const one = parts[0].split("").reverse().join("");
        const two = select.split("").reverse().join("");
        const three = parts[1].split("").reverse().join("");
        console.log("value: ",value, "1. " , one, "2. " , two, "3. " , three);
    }
    
}


function addIndexPasuk(index) {
    const some = index % 10;
    const tens = index % 100 - some;
    const hundreds = index - tens - some;
    return ' ' + VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some].replace('טז', 'יו').replace('טו', 'יה');

}

function calculate(value) {
    return ('$$' + value).split('').map(c => VAL[c] || 0).reduce((a, b) => a + b);
}

function rejects(word) {
    if (typeof word == typeof "") {
        return word.split('').map(c => c.match(/[א-ת]/) ? c.match(/[א-ת]/)[0] : '').join('');
    }
}

function clean(word) {
    if (typeof word == typeof "") {
        const twoOrMoreSpaces = /\s+/g;
        const betweenTwoHalfBrackets = /\([^)]*\)|\[[^\]]*\]/g;
        return word.replace(/[a-z]|[0-9]|<|>|-|"|=|/g, "").replaceAll("{ס}", "").replaceAll("{פ}", "")
        .replace(betweenTwoHalfBrackets, "").replaceAll("/", "").replaceAll("|", "").replaceAll("*", "").replaceAll(twoOrMoreSpaces, " ");
    }
}

function inRange(gematria, min) {
    let max = min + 300;
    nameOfFile = "gematriot-tora-" + min + "-" + max + ".js";
    nameOfObject = "const tora_" + min + "_" + max + " = ";
    // console.log(gematria, min, max, gematria >= min && gematria < max);
    return gematria >= min && gematria < max;
}

function switchObject(result) {
    for (let i = 1; i < 2000; i = i + 100) {
        if (result < i) {
            return arrayOfObjects[i];
        }

    }
}



