

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
    let objSource = {};
    switch (source) {
        case 1:
            obj = gemTora;
            objSource = gemSourceTora;
            hedderBtn2.innerText = "המילים בתורה";
            hedderBtn3.innerText = 'פסוקים לש"א בתורה';
            break;
        case 2:
            obj = gemNevihim;
            objSource = gemSourceNevihim;
            hedderBtn2.innerText = "המילים בנביאים";
            hedderBtn3.innerText = 'פסוקים לש"א בנביאים';

            break;
        case 3:
            obj = gemCetuvim;
            objSource = gemSourceCetuvim;
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
            setGematrya(value, obj, objSource);
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


function setGematrya(value, obj, objSource) {
    document.getElementById("subject").innerText = "מילים בתורה עם אותה גימטריה";
    const sum = calculate(value);
    setHistory(sum, value);
    setGematriaRows(sum, obj, objSource)
}

function setHistory(sum, value) {
    let history = [];
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
}

function setOption(value) {
    option = value;
    main();
}

function setSource(value) {
    source = value;
    main();
}


function addIndexInHebrew(index) {
    const some = index % 10;
    const tens = index % 100 - some;
    const hundreds = index - tens - some;
    console.log(hundreds, tens, some);
    console.log(VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some]);
    return ' ' + VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some];

}

// function addToTheTable(sum) {
//     torahValues = gemOfTorah[sum];
//     let tableRef = document.getElementById("table");
//     while (tableRef.rows.length > 1) {
//         tableRef.deleteRow(1);
//     }
//     if (torahValues && torahValues.length) {
//         torahValues.forEach((arr) => {

//             const mainOfPasuk = arr[1];

//             const wordSpan = document.createElement("span");
//             wordSpan.style.backgroundColor = "yellow";
//             wordSpan.textContent = mainOfPasuk;

//             const source = arr[3];
//             let newRow = tableRef.insertRow(-1);

//             let sourceCell = newRow.insertCell(0);
//             let pasukCell = newRow.insertCell(1);

//             pasukCell.classList.add("pesukim");

//             let sourceText = document.createTextNode(source);
//             let pasukText1 = document.createTextNode(arr[0]);
//             let pasukText2 = document.createTextNode(arr[2]);

//             sourceCell.appendChild(sourceText);
//             pasukCell.appendChild(pasukText1);
//             pasukCell.appendChild(wordSpan);
//             pasukCell.appendChild(pasukText2);

//         });
//     }

// }

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
       //console.log(v);
        const seferName = k;
        v.forEach((perek, indexPerek) => {
            perek.forEach((pasuk, indexPasuk) => {
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
                    listOfSamePesukim.push([rightOfPasuk, selectWords, leftOfPasuk, seferName + " " + addIndexInHebrew(indexPerek + 1) + addIndexInHebrew(indexPasuk + 1)]);
                }

            }
            });
           
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
        const seferName = k;
        v.forEach((perek, indexPerek) => {
            perek.forEach((pasuk, indexPasuk) => {
            const pasukChars = rejects(pasuk).split("");
            const firstCharPasuk = pasukChars[0];
            const lastCharPasuk = pasukChars[pasukChars.length - 1];

            if (firstCharValue == firstCharPasuk && lastCharValue == lastCharPasuk) {
                listOfPesukim.push(['', '', pasuk, seferName + " " + addIndexInHebrew(indexPerek + 1) + addIndexInHebrew(indexPasuk + 1)])
            }  
        });
    });
    }
    if (!listOfPesukim.length) {
        listOfPesukim.push(['','אין פסוקים','','אין מקורות']);
    }
        fillTable(listOfPesukim);
}

function setGematriaRows(sum, obj, objSource) {
    const sources = objSource[sum];
    const listOfRows = [];
    sources.forEach(source => {
        const seferName = source[0];
        const perek = source[1];
        const pasuk = source[2];
        const start = source[3];
        const end = source[4];
        const row = getPasukBySource(obj, seferName, perek, pasuk, start, end);
        listOfRows.push(row);
    });
    if (!listOfRows.length) {
        listOfRows.push(['','אין פסוקים','','אין מקורות']);
    }

        fillTable(listOfRows);
}

function getPasukBySource(obj, seferName, perek, pasuk, start, end) {
    const entirePasuk = obj[seferName][perek][pasuk];
    if (!entirePasuk) {
        debugger;  
        return ["","","",""];
      }
    const selectWords = entirePasuk.split(" ").slice(start, end).join(" ");
    if (!selectWords) {
      debugger;  
      return ["","","",""];
    }
    const splitPasuk = entirePasuk.split(selectWords);
    const right = splitPasuk[0];
    const left = splitPasuk[1];
    const source = seferName + " " + addIndexInHebrew(perek + 1) + " " + addIndexInHebrew(pasuk + 1);
    return [right, selectWords, left, source];
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
