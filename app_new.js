const FS = require('fs');

const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

let seferLength = 20;

let nameOfFile = "gem-nevihim-source.js";

let nameOfObject = "const gemSourceNevihim = ";



Object.keys(VAL).forEach(function (key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
});

let gemOfTorah = {};
let sourceOfGems = {}

main();

function main() {

    gemOfTorah = {};
    let rawdata = FS.readFileSync('gem-nevihim.json');
    gemOfTorah = JSON.parse(rawdata);
    console.log("start");
    getChumashimAndPrintFile();
   
}



function writeAFile() {
    const ObjectJson = JSON.stringify(sourceOfGems);
    FS.writeFileSync(nameOfFile, nameOfObject + ObjectJson);
}



function getChumashimAndPrintFile() {


    for (const [k, v] of Object.entries(gemOfTorah)) {
        let seferName = k;
        let sefer = v;
        setTimeout(() => {
            setListOfNumbersInTora(gemOfTorah, seferName, sefer);
        }, seferLength);
    }

    setTimeout(() => {
        writeAFile()
    }, 22000);
}





function setListOfNumbersInTora(gemOfTorah, seferName, sefer) {
    console.log(seferName);
    seferLength = sefer.length * 100;
    sefer.forEach((perek, perekIndex) => {
        perek.forEach((pasuk, pasukIndex) => {
            wordsOfPasuk = pasuk.split(' ');
            for (let i = 0; i < wordsOfPasuk.length; i++) {
                for (let j = i + 1; j <= wordsOfPasuk.length; j++) {
                    let words = wordsOfPasuk.slice(i, j);
                    if (words.length) {
                        let word = words.join(' ');
                        const calculatedWord = calculate(word);
                        if (!gemOfTorah[calculatedWord]) {
                            gemOfTorah[calculatedWord] = [];
                        }
                        wordWithoutNikud = rejects(word);
                        if (!gemOfTorah[calculatedWord].filter(oldWord => rejects(oldWord) == wordWithoutNikud).length) {
                            gemOfTorah[calculatedWord].push(word);
                            const start = i;
                            const end = j;
                            addToTheSourceObj(calculatedWord, seferName, perekIndex, pasukIndex, start, end);
                        }

                    }
                }
            }
        });
    });

}

function addToTheSourceObj(value, seferName, perek, pasuk, start, end) {
    const source = [seferName, perek, pasuk, start, end];
    if (!sourceOfGems[value]) {
        sourceOfGems[value] = [];
    }
    sourceOfGems[value].push(source);
    // //testing
    // const entirePasuk = gemOfTorah[seferName][perek][pasuk];
    // const select = entirePasuk.split(" ").slice(start, end).join(" ");
    // const parts = entirePasuk.split(select);
    // if (value < 100) {
    //     const one = parts[0].split("").reverse().join("");
    //     const two = select.split("").reverse().join("");
    //     const three = parts[1].split("").reverse().join("");
    //     console.log("value: ", value, "1. ", one, "2. ", two, "3. ", three);
    // }

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




