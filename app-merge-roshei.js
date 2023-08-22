const FS = require('fs');

const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

let seferLength = 20;

let nameOfFile = "gem-roshei.js";

let nameOfObject = "const gemRoshei = ";

let fileToRead1 = "gem-tora-roshei.json";
let fileToRead2 = "gem-nevihim-roshei.json";
let fileToRead3 = "gem-cetuvim-roshei.json";

Object.keys(VAL).forEach(function (key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
});

let gemOfTorah = {};
let gemOfTorah1 = {};
let gemOfTorah2 = {};
let gemOfTorah3 = {};
let rosheiObject = {}

main();

function main() {

    gemOfTorah = {};
    //setObjects(3);
    let rawdata1 = FS.readFileSync(fileToRead1);
    gemOfTorah1 = JSON.parse(rawdata1);
    let rawdata2 = FS.readFileSync(fileToRead2);
    gemOfTorah2 = JSON.parse(rawdata2);
    let rawdata3 = FS.readFileSync(fileToRead3);
    gemOfTorah3 = JSON.parse(rawdata3);
    gemOfTorah['tora'] = gemOfTorah1;
    gemOfTorah['nevihim'] = gemOfTorah2;
    gemOfTorah['cetuvim'] = gemOfTorah3;
    getChumashimAndPrintFile();
}

function setObjects(type) {
    switch (type) {
        case 1:
            nameOfFile = "gem-tora-roshei.json";
            nameOfObject = "";// "const gemRosheiTora = ";
            fileToRead = "gem-tora.json";
            break;
        case 2:
            nameOfFile = "gem-nevihim-roshei.json";
            nameOfObject = "";//  "const gemRosheiNevihim = ";
            fileToRead = "gem-nevihim.json";

            break
        case 3:
            nameOfFile = "gem-cetuvim-roshei.json";
            nameOfObject = "";//  "const gemRosheiCetuvim = ";
            fileToRead = "gem-cetuvim.json";
            break;
        default:
            break;
    }
}

function writeAFile() {
    const ObjectJson = JSON.stringify(gemOfTorah);
    FS.writeFileSync(nameOfFile, nameOfObject + ObjectJson);
}



function getChumashimAndPrintFile() {

    // for (const [k, v] of Object.entries(gemOfTorah)) {
    //     let seferName = k;
    //     let sefer = v;
    //     setTimeout(() => {
    //         setListOfRosheiTeivotInTora(seferName, sefer);
    //     }, seferLength * 10);
    // }

    setTimeout(() => {
        writeAFile()
    }, 2000);
}


function setListOfRosheiTeivotInTora(seferName, sefer) {
    console.log(seferName);
    seferLength = sefer.length * 100;
    sefer.forEach((perek, perekIndex) => {
        perek.forEach(pasuk => {
            wordsOfPasuk = pasuk.replaceAll("־"," ").replaceAll("־"," ").split(' ');
            const rosheiPasuk = wordsOfPasuk.map(word => word[0]).join("");
            if (!rosheiObject[seferName]) {
                rosheiObject[seferName] = [];
            }
            if (!rosheiObject[seferName][perekIndex]) {
                rosheiObject[seferName][perekIndex] = "";
            }
            rosheiObject[seferName] += rosheiPasuk;
        });
    });

}


function rejects(word) {
    if (typeof word == typeof "") {
        return word.split('').map(c => c.match(/[א-ת]/) ? c.match(/[א-ת]/)[0] : '').join('');
    }
}