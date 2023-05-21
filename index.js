

let gemOfTorah = tora_0_300;

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


function setGematrya(value) {
    setListOfSameInTora(objTora, value);
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
    let tableRef = document.getElementById("the-value");
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

            let sourceText = document.createTextNode(source);
            let pasukText1 = document.createTextNode(arr[0]);
            let pasukText2 = document.createTextNode(arr[2]);

            sourceCell.appendChild(sourceText);
            pasukCell.appendChild(pasukText1);
            pasukCell.appendChild(wordSpan);
            pasukCell.appendChild(pasukText2);

            //from chat GPT
            //  // Create a <span> element
            //  // Set yellow background color
            //  value; // Set the text content of the <span>

            // sourceCell.appendChild(sourceText);
            // wordCell.appendChild(wordSpan); // Append the <span> element to the cell

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
    // console.log('word-1:', word, typeof word == typeof "");
    if (typeof word == typeof "") {
        return word.split('').map(c => c.match(/[א-ת]/) ? c.match(/[א-ת]/)[0] : '').join('');
    }
    // word.match(/[^t]/);//    .replace('/^[a-z]/','1');
}

function clean(word) {
    if (typeof word == typeof "") {

        return word.replace(/[a-z]|[0-9]|<|>|-|"|=|/g, "").replace("{ס}", "").replace("{פ}", "").replace("/", "").replace("|", "");
    }
}

function setListOfSameInTora(obj, value) {
    for (const [k, v] of Object.entries(obj)) {
        const sourcePerek = k;
        v.forEach(pasuk => {
            //console.log(pasuk);
           if (rejects(pasuk).includes(value)) {
                console.log(pasuk);
           }
        });

        //console.log(`${key}: ${value}`);
      }
      console.log('\t\t\t\t\t\t\t');
      return;
    if (perek.he) {
        console.log(perek.he.length, min);
        perekLength = perek.he.length * 22;
        perek.he.forEach((pasuk, index) => {
            // console.log(e, index);
            // console.log(1, pasuk);
            pasuk = clean(pasuk);
            // console.log(2, pasuk);
            const sourcePasuk = addIndexPasuk(index + 1);
            wordsOfPasuk = pasuk.split(' ');
            for (let i = 0; i < wordsOfPasuk.length; i++) {
                for (let j = i + 1; j <= wordsOfPasuk.length; j++) {
                    let words = wordsOfPasuk.slice(i, j);
                    if (words.length) {
                        let word = words.join(' ');
                        if (inRange(calculate(word), min)) {
                            let entirePasuk = pasuk.split(word);
                            const pasukWithSource = [entirePasuk[0], word, entirePasuk[1], perek.heRef + sourcePasuk];
                            if (!gemOfTorah[calculate(word)]) {
                                gemOfTorah[calculate(word)] = [];
                            }
                            // console.log('word:', word, rejects(word) );
                            wordWithoutNikud = rejects(word);
                            //gemOfTorah[calculate(word)] = ;
                            if (!gemOfTorah[calculate(word)].filter(pasuk => rejects(pasuk[1]) == wordWithoutNikud).length) {
                                gemOfTorah[calculate(word)].push(pasukWithSource);
                            }

                        }

                    }
                }
            }
        });
    }
}

function switchObject(sum) {
    switch (inRange(sum)) {
        case 0:
            gemOfTorah = tora_0_300;
            break;
        case 300:
            gemOfTorah = tora_300_600;
            break;
        case 600:
            gemOfTorah = tora_600_900;
            break;
        case 900:
            gemOfTorah = tora_900_1200;
            break;
        case 1200:
            gemOfTorah = tora_1200_1500;
            break;
        case 1500:
            gemOfTorah = tora_1500_1800;
            break;
        case 1800:
            gemOfTorah = tora_1800_2100;
            break;
        case 2100:
            gemOfTorah = tora_2100_2400;
            break;
        case 2400:
            gemOfTorah = tora_2400_2700;
            break;
        case 2700:
            gemOfTorah = tora_2700_3000;
            break;
        case 3000:
            gemOfTorah = tora_3000_3600;
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
