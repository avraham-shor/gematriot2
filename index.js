let gemOfTorah = {};
let option = 1;
let source = 1;


async function main() {
    const value = document.getElementById("chars").value;
    const sum = calculate(value);
    document.getElementById('sum').innerText = sum;
    const hedderBtn1 = document.getElementById("hedderBtn1");
    const hedderBtn2 = document.getElementById("hedderBtn2");
    const hedderBtn3 = document.getElementById("hedderBtn3");
    const hedderBtn4 = document.getElementById("hedderBtn4");
    let obj = {};
    let objSource = {};
    let objRoshei = {};
    switch (source) {
        case 1:
            obj = gemTora;
            objSource = await gemSourceTora || {};
            objRoshei = gemRoshei['tora'] || {};
            hedderBtn1.innerText = "הגימטריה בתורה";
            hedderBtn2.innerText = "המילים בתורה";
            hedderBtn3.innerText = 'פסוקים לש"א בתורה';
            hedderBtn4.innerText = 'ר"ת בתורה';
            break;
        case 2:
            obj = gemNevihim;
            objSource = await gemSourceNevihim || {};
            objRoshei = gemRoshei['nevihim'] || {};
            hedderBtn1.innerText = "הגימטריה בנביאים";
            hedderBtn2.innerText = "המילים בנביאים";
            hedderBtn3.innerText = 'פסוקים לש"א בנביאים';
            hedderBtn4.innerText = 'ר"ת בנביאים';


            break;
        case 3:
            obj = gemCetuvim;
            objSource = await gemSourceCetuvim || {};
            objRoshei = gemRoshei['cetuvim'] || {};
            hedderBtn1.innerText = "הגימטריה בכתובים";
            hedderBtn2.innerText = "המילים בכתובים";
            hedderBtn3.innerText = 'פסוקים לש"א בכתובים';
            hedderBtn4.innerText = 'ר"ת בכתובים';


            break;
        default:
            obj = gemTora;
            hedderBtn1.innerText = "הגימטריה בתורה";
            hedderBtn2.innerText = "המילים בתורה";
            hedderBtn3.innerText = 'פסוקים לש"א בתורה';
            hedderBtn4.innerText = 'ר"ת בתורה';

            break;
    }

    switch (option) {
        case 1:
            setGematrya(value, sum, obj, objSource);
            break;
        case 2:
            setListOfSameInTora(obj, value);
            break;
        case 3:
            setPesukimForPeopleNames(obj, value)
            break;
        case 4:
            setRosheiTeivot(value, obj, objRoshei)
            break;
        default:
            setGematrya(value)
            break;
    }
}


function setGematrya(value, sum, obj, objSource) {
    document.getElementById("subject").innerText = "מילים בתורה עם אותה גימטריה";
    //setHistory(sum, value);
    setGematriaRows(sum, obj, objSource)
}

function setHistory(sum, value) {
    let history = [];
    localStorage.getItem('history') ? history = localStorage.getItem('history').split('%%') : [];
    history = history.filter((v, i) => history.indexOf(v) === i).sort();
    document.getElementById('history').innerText = history.filter(e => calculate(e) == sum && e != value);
    if (document.getElementById('history').innerText.length < 1) {
        document.getElementById('history').innerText = ' אין מילים בהיסטוריה שלך שמתאימות לגימטריא זו';
    }
    let cleanValue = clean(value);
    if (sum > 0 && value.length > 1) history.push(cleanValue + " ");
    localStorage.setItem('history', history.join('%%'));
}

function setOption(value) {
    debugger;
    option = value;
    const hedderBtn1 = document.getElementById("hedderBtn1");
    const hedderBtn2 = document.getElementById("hedderBtn2");
    const hedderBtn3 = document.getElementById("hedderBtn3");
    const hedderBtn4 = document.getElementById("hedderBtn4");
    const buttons = [hedderBtn1, hedderBtn2, hedderBtn3, hedderBtn4];
    setColorButtons(value, buttons);
    main();
}

function setColorButtons(source, buttons) {
    let nonSelects = getArrRange(1, buttons.length).filter(num => num != source);
    nonSelects.forEach(num => {
        // const button = buttons[num - 1];
        // if (button) {
        //     button.classList.remove("light-blue");
        // }
        buttons[num - 1].classList.remove("light-blue");
    });
    buttons[source - 1].classList.add("light-blue");
}

function setSource(value) {
    source = value;
    const hedderBtn1 = document.getElementById("btn1");
    const hedderBtn2 = document.getElementById("btn2");
    const hedderBtn3 = document.getElementById("btn3");
    const buttons = [hedderBtn1, hedderBtn2, hedderBtn3];
    setColorButtons(source, buttons);
    main();
}


function addIndexInHebrew(index) {
    const some = index % 10;
    const tens = index % 100 - some;
    const hundreds = index - tens - some;
    // console.log(hundreds, tens, some);
    // console.log(VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some]);
    return (' ' + VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some]).replace("יה","טו").replace("יו","טז");

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

function getArrRange(start, end) {
    return Array.apply(0, Array(end))
      .map((element, index) => index + start);
  }

function setListOfSameInTora(obj, value) {

    document.getElementById("subject").innerText = "מקומות שכתובים שם המילה או המילים שהזנת";
    const listOfSamePesukim = [];
    if (value.includes(" ")) {
        value = value.replaceAll(/\s+/g, "");
    }
    for (const [k, v] of Object.entries(obj)) {
        const seferName = k;
        v.forEach((perek, indexPerek) => {
            perek.forEach((pasuk, indexPasuk) => {
                if (value.length && rejects(pasuk).includes(value)) {
                    // debugger;
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
                            selectWords = CheckAgainThoroughly(pasuk, value);
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
        listOfSamePesukim.push(['', 'אין פסוקים', '', 'אין מקורות']);
    }

    fillTable(listOfSamePesukim);
}

function CheckAgainThoroughly(pasuk, value) {
    const chars = pasuk.split('');
    const start = focusToStart(pasuk, value);
    let same = chars[start];
    for (let i = start + 1; i < chars.length; i++) {
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
        listOfPesukim.push(['', 'אין פסוקים', '', 'אין מקורות']);
    }
    fillTable(listOfPesukim);
}

function setGematriaRows(sum, obj, objSource) {
    const sources = objSource[sum];
    const listOfRows = [];
    if (sources && sources.length) {
        sources.forEach(source => {
            const seferName = source[0];
            const perek = source[1];
            const pasuk = source[2];
            const start = source[3];
            const end = source[4];
            const row = getPasukBySource(obj, seferName, perek, pasuk, start, end);
            listOfRows.push(row);
        });
    }
    
    if (!listOfRows.length) {
        listOfRows.push(['', 'אין פסוקים', '', 'אין מקורות']);
    }

    fillTable(listOfRows);
}

function setRosheiTeivot(value, obj, objRoshei) {
    const listOfRosheiTeivot = [];
    // Replace the endChars to simple chars.
    value = value.replaceAll(/\s+/g, "").replaceAll("ך", "כ").replaceAll("ם", "מ")
    .replaceAll("ן", "נ").replaceAll("ף", "פ").replaceAll("ץ", "צ");

    document.getElementById("subject").innerText = "מילים המתחילות עם האותיות האלו";
    if (value.length) {
        for (const [k, v] of Object.entries(objRoshei)) {
        const seferName = k;
        const seferRoshei = v;
        // console.log(seferRoshei);
        seferRoshei.forEach((perekRoshei, indexPerek) => {
            if (perekRoshei.includes(value)) {
                let numWordsBefore = perekRoshei.split(value)[0].length;
                let selectWords = "";
                let right;
                let left;
                console.log(seferName, indexPerek);
                valueLength = value.length;
                let pasukIndex;
                let lastPasukIndex;
                let firstIndex;
                // console.log(perekRoshei);
                obj[seferName][indexPerek].forEach((pasuk, index) => {
                    wordsOfPasuk = pasuk.replaceAll("־"," ").split(" ").filter(word => word.length);

                    if (wordsOfPasuk.length <= numWordsBefore) {
                        numWordsBefore -= wordsOfPasuk.length
                    }
                    else {
                        let end;
                        if (!pasukIndex) {
                            pasukIndex = addIndexInHebrew(index + 1);
                        }
                        if (!firstIndex) {
                           firstIndex = index; 
                        }
                        if (wordsOfPasuk.length - numWordsBefore > valueLength) {
                         end = numWordsBefore + valueLength; 
                        }
                        if (valueLength > 0) {
                            if (!right) {
                                right = wordsOfPasuk.slice(0, numWordsBefore).join(" ") + " ";
                            }
                            if (end) {
                                left = " " + wordsOfPasuk.slice(end).join(" ");
                            }
                            wordsOfPasuk = wordsOfPasuk.slice(numWordsBefore, end);
                            
                        valueLength -= wordsOfPasuk.length;
                        selectWords += wordsOfPasuk.join(" ") + " ";
                        numWordsBefore = 0;
                        lastPasukIndex = index != firstIndex? " - " + addIndexInHebrew(index + 1) : "";
                        }
                        
                    }
                })
                listOfRosheiTeivot.push([right, selectWords, left, seferName + " " + addIndexInHebrew(indexPerek + 1) + pasukIndex + lastPasukIndex]);
            }
        });
     }
    }
    if (!listOfRosheiTeivot.length) {
        listOfRosheiTeivot.push(['', 'אין מילים המתחילות עם האותיות האלו', '', 'אין מקורות']);
    }

    fillTable(listOfRosheiTeivot);
}

function getPasukBySource(obj, seferName, perek, pasuk, start, end) {
    const entirePasuk = obj[seferName][perek][pasuk];
    if (!entirePasuk) {
        debugger;
        return ["", "", "", ""];
    }
    const selectWords = entirePasuk.split(" ").slice(start, end).join(" ");
    if (!selectWords) {
        debugger;
        return ["", "", "", ""];
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
    listOfSamePesukim.forEach((arrayOfPasuk, index) => {

        const wordSpan = document.createElement("span");
        wordSpan.style.backgroundColor = "yellow";
        wordSpan.textContent = arrayOfPasuk[1];

        let newRow = tableTheSame.insertRow(-1);

        let counterCell = newRow.insertCell(0);
        let sourceCell = newRow.insertCell(1);
        let pasukCell = newRow.insertCell(2);

        pasukCell.classList.add("pesukim");

        let counterText = document.createTextNode(index +1);
        let sourceText = document.createTextNode(arrayOfPasuk[3]);
        let pasukText1 = document.createTextNode(arrayOfPasuk[0]);
        let pasukText2 = document.createTextNode(arrayOfPasuk[2]);

        counterCell.appendChild(counterText);
        sourceCell.appendChild(sourceText);
        pasukCell.appendChild(pasukText1);
        pasukCell.appendChild(wordSpan);
        pasukCell.appendChild(pasukText2);
    });

}