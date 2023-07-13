

let gemOfTorah = {};
let option = 1;
let source = 1;

// console.log(JSON.stringify(objTora, null, 4));

// console.log(gemObject);
// gemObject.forEach(n => {
//     console.log(n);
// });
// $.getJSON( "gematriot.json" )
//   .done(function( json ) {
//     console.log( "JSON Data: " );
//   })
//   .fail(function( jqxhr, textStatus, error ) {
//     var err = textStatus + ", " + error;
//     console.log( "Request Failed: " + err );
// });


// getTora("gematriot.json")
// .then(response => {
//    return response.json();
// })
// .then(jsondata => console.log(jsondata));

// CHUMASHIM.forEach(chumash => {
//     const CHUMASH = Object.keys(chumash)[0];
//     const range = chumash[CHUMASH]
//     for (let i = 0; i <= range; i++) {
//         getTora(BASE_URL + CHUMASH + i + PARAMS).then(data => {
//             data.json().then(perek => {
//                 setListOfNumbersInTora(gemOfTorah, perek);
//             })
//         });
//     }
// })
function main() {
    const value = document.getElementById("chars").value;
    const hedderBtn2 = document.getElementById("hedderBtn2");
    const hedderBtn3 = document.getElementById("hedderBtn3");
    let obj = {};
    switch (source) {
        case 1:
            obj = objTora;
            hedderBtn2.innerText = "המילים בתורה";
            hedderBtn3.innerText = 'פסוקים לש"א בתורה';
            break;
        case 2:
            obj = objNevihim;
            hedderBtn2.innerText = "המילים בנביאים";
            hedderBtn3.innerText = 'פסוקים לש"א בנביאים';

            break;
        case 3:
            obj = objKetuvim;
            hedderBtn2.innerText = "המילים בכתובים";
            hedderBtn3.innerText = 'פסוקים לש"א בכתובים';

            break;
        default:
            obj = objTora;
            hedderBtn2.innerText = "המילים בתורה";
            hedderBtn3.innerText = "פסוקים לשמות אנשים בתורה";

            break;
    }

    switch (option) {
        case 1:
            setGematrya(value)
            break;
        case 2:
            setListOfSameInTora(obj, value);
            break;
        case 3:
            setPesukimForPeopleNames(obj, value)
            break;
        default:
            setGematrya(value)
            break;
    }
}


function setGematrya(value) {
    document.getElementById("subject").innerText = "מילים בתורה עם אותה גימטריה";
    let history = [];
    const sum = calculate(value);
    switchObject(sum);
    document.getElementById('sum').innerText = sum;
    localStorage.getItem('history') ? history = localStorage.getItem('history').split('%%') : [];
    history = history.filter((v, i) => history.indexOf(v) === i).sort();
    document.getElementById('history').innerText = history.filter(e => calculate(e) == sum && e != value);
    if (document.getElementById('history').innerText.length < 1) {
        document.getElementById('history').innerText = ' אין מילים בהיסטוריה שלך שמתאימות לגימטריא זו';
    }
    let cleanValue = clean(value);
    if (sum > 0 && value.length > 1) history.push(cleanValue + " ");
    // console.log('history:', history);
    localStorage.setItem('history', history.join('%%'));

    addToTheTable(sum);
}

function setOption(value) {
    option = value;
    main();
}

function setSource(value) {
    source = value;
    main();
}


function addIndexPasuk(index) {
    const some = index % 10;
    const tens = index % 100 - some;
    const hundreds = index - tens - some;
    console.log(hundreds, tens, some);
    console.log(VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some]);
    return ' ' + VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some];

}

function addToTheTable(sum) {
    torahValues = gemOfTorah[sum];
    let tableRef = document.getElementById("table");
    while (tableRef.rows.length > 1) {
        tableRef.deleteRow(1);
    }
    if (torahValues && torahValues.length) {
        torahValues.forEach((arr) => {

            const mainOfPasuk = arr[1];

            const wordSpan = document.createElement("span");
            wordSpan.style.backgroundColor = "yellow";
            wordSpan.textContent = mainOfPasuk;

            const source = arr[3];
            let newRow = tableRef.insertRow(-1);

            let sourceCell = newRow.insertCell(0);
            let pasukCell = newRow.insertCell(1);

            pasukCell.classList.add("pesukim");

            let sourceText = document.createTextNode(source);
            let pasukText1 = document.createTextNode(arr[0]);
            let pasukText2 = document.createTextNode(arr[2]);

            sourceCell.appendChild(sourceText);
            pasukCell.appendChild(pasukText1);
            pasukCell.appendChild(wordSpan);
            pasukCell.appendChild(pasukText2);

        });
    }

}

function calculate(value) {
    return ('$$' + value).split('').map(c => VAL[c] || 0).reduce((a, b) => a + b);
}

async function getTora(url) {
    const response = await fetch(url);
    return response;

}

function rejects(word) {
    if (typeof word == typeof "") {
        return word.split('').map(c => c.match(/[א-ת]/) ? c.match(/[א-ת]/)[0] : '').join('');
    }
}

function clean(word) {
    if (typeof word == typeof "") {
        return word.replace(/[a-z]|[0-9]|<|>|-|"|=|/g, "").replace("{ס}", "").replace("{פ}", "").replace("/", "").replace("|", "");
    }
}

function setListOfSameInTora(obj, value) {
    document.getElementById("subject").innerText = "המילים האלו כתובים בתורה כאן";
    const listOfSamePesukim = [];
    for (const [k, v] of Object.entries(obj)) {
        const sourcePerek = k;
        v.forEach((pasuk, index) => {

            if (rejects(pasuk).includes(value) && value.length) {
                const mainWords = [];
                const wordsOfPasuk = pasuk.split(" ");
                for (let i = 0; i < wordsOfPasuk.length; i++) {
                    const word = wordsOfPasuk[i];
                    //check which words in the Pasuk are the same text
                    if (value.includes(rejects(word)) && word.length) {
                        //debugger;
                        mainWords.push(word);
                    }
                    else if (mainWords.length) break;
                }
                if (mainWords.length) {
                    let selectWords = mainWords.join(" ");
                    if (value != rejects(selectWords)) {
                       selectWords = CheckAgainThoroughly(pasuk,value);
                    }
                    const arr = pasuk.split(selectWords);
                    const rightOfPasuk = arr[0];
                    const leftOfPasuk = arr[1];
                    listOfSamePesukim.push([rightOfPasuk, selectWords, leftOfPasuk, sourcePerek + addIndexPasuk(index + 1)]);
                }

            }
        });
    }
    if (!listOfSamePesukim.length) {
        listOfSamePesukim.push(['','אין פסוקים','','אין מקורות']);
    }

        fillTable(listOfSamePesukim);
}

function CheckAgainThoroughly(pasuk, value) {
    debugger;
    const chars = pasuk.split('');
    const start = focusToStart(pasuk, value);
    let same = chars[start];
    for (let i = start+1; i < chars.length; i++) {
        const char = chars[i];
        if (same.length && value.includes(rejects(same + char))) {
            same += char;
            if (rejects(same) == value) {
                return same;
            }
        }
        else same = char;
    }
}

function focusToStart(pasuk, value) {
    //Estimated start 
    let index = rejects(pasuk).indexOf(value);
    index = pasuk.indexOf(value[0], index);
    return index;
}

function setPesukimForPeopleNames(obj, value) {
    document.getElementById("subject").innerText = "פסוקים לשמות האנשים";
    const chars = value.split("");
    const firstCharValue = chars[0];
    const lastCharValue = chars[chars.length - 1];
    const listOfPesukim = [];
    for (const [k, v] of Object.entries(obj)) {
        const sourcePerek = k;
        v.forEach((pasuk, index) => {
            const pasukChars = rejects(pasuk).split("");
            const firstCharPasuk = pasukChars[0];
            const lastCharPasuk = pasukChars[pasukChars.length - 1];

            if (firstCharValue == firstCharPasuk && lastCharValue == lastCharPasuk) {
                listOfPesukim.push(['', '', pasuk, sourcePerek + addIndexPasuk(index + 1)])
            }  
        });
    }
    if (!listOfPesukim.length) {
        listOfPesukim.push(['','אין פסוקים','','אין מקורות']);
    }
        fillTable(listOfPesukim);
}

function switchObject(sum) {
    switch (inRange(sum)) {
        case 0:
            gemOfTorah = tora_0_300 || {};
            break;
        case 300:
            gemOfTorah = tora_300_600 || {};
            break;
        case 600:
            gemOfTorah = tora_600_900 || {};
            break;
        case 900:
            gemOfTorah = tora_900_1200 || {};
            break;
        case 1200:
            gemOfTorah = tora_1200_1500 || {};
            break;
        case 1500:
            gemOfTorah = tora_1500_1800 || {};
            break;
        case 1800:
            gemOfTorah = tora_1800_2100 || {};
            break;
        case 2100:
            gemOfTorah = tora_2100_2400 || {};
            break;
        case 2400:
            gemOfTorah = tora_2400_2700 || {};
            break;
        case 2700:
            gemOfTorah = tora_2700_3000 || {};
            break;
        case 3000:
            gemOfTorah = tora_3000_3600 || {};
            break;


        default:
            break;
    }
}

function inRange(sum) {
    if (sum < 3000) {
        return sum - sum % 300;
    }
    if (sum >= 6000) {
        return end
    }
    return sum - sum % 600;
}


function fillTable(listOfSamePesukim) {

    let tableTheSame = document.getElementById("table");
    while (tableTheSame.rows.length > 1) {
        tableTheSame.deleteRow(1);
    }
    listOfSamePesukim.forEach(arrayOfPasuk => {

        const wordSpan = document.createElement("span");
        wordSpan.style.backgroundColor = "yellow";
        wordSpan.textContent = arrayOfPasuk[1];




        let newRow = tableTheSame.insertRow(-1);

        let sourceCell = newRow.insertCell(0);
        let pasukCell = newRow.insertCell(1);

        pasukCell.classList.add("pesukim");

        let sourceText = document.createTextNode(arrayOfPasuk[3]);
        let pasukText1 = document.createTextNode(arrayOfPasuk[0]);
        let pasukText2 = document.createTextNode(arrayOfPasuk[2]);

        sourceCell.appendChild(sourceText);
        pasukCell.appendChild(pasukText1);
        pasukCell.appendChild(wordSpan);
        pasukCell.appendChild(pasukText2);
    });

}
