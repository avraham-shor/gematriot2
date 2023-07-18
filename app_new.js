const FS = require('fs');

const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

let seferLength = 20;

let nameOfFile = "gem-tora-source.js";

let nameOfObject = "const gemSourceTora = ";

let fileToRead = "gem-cetuvim.json";


Object.keys(VAL).forEach(function (key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
});

let gemOfTorah = {};
let sourceOfGems = {}

main();

function main() {

    gemOfTorah = {};
    setObjects(1);
    let rawdata = FS.readFileSync(fileToRead);
    gemOfTorah = JSON.parse(rawdata);
    console.log("start");
    getChumashimAndPrintFile();
   console.log("end");
}

function setObjects(type) {
    switch (type) {
        case 1:
            nameOfFile = "gem-tora-source.js";
            nameOfObject = "const gemSourceTora = ";
            fileToRead = "gem-tora.json";
            break;
        case 2:
            nameOfFile = "gem-nevihim-source.js";
            nameOfObject = "const gemSourceNevihim = ";
            fileToRead = "gem-nevihim.json";

            break
        case 3:
            nameOfFile = "gem-cetuvim-source.js";
            nameOfObject = "const gemSourceCetuvim = ";
            fileToRead = "gem-cetuvim.json";
            break;
        default:
            break;
    }
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
                        if (calculatedWord < 100) { // || calculatedWord == 0 || !gemOfTorah[calculatedWord].filter(oldWord => rejects(oldWord) == wordWithoutNikud).length) {
                            console.log(pasuk.split("").reverse().join(""));
                            console.log(calculatedWord, word.split("").reverse().join(""));
                            gemOfTorah[calculatedWord].push(word);
                            const start = i;
                            const end = j;
                            console.log(seferName, perekIndex, pasukIndex, start, end);
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


function calculate(value) {
    return ('$$' + value).split('').map(c => VAL[c] || 0).reduce((a, b) => a + b);
}

function rejects(word) {
    if (typeof word == typeof "") {
        return word.split('').map(c => c.match(/[א-ת]/) ? c.match(/[א-ת]/)[0] : '').join('');
    }
}




