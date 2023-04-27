let gemOfTorah = gemObject;


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
    let history = [];
    const sum = calculate(value);
    document.getElementById('sum').innerText = sum;
    localStorage.getItem('history') ? history = localStorage.getItem('history').split('%%') : [];
    history = history.filter((v, i) => history.indexOf(v) === i).sort();
    document.getElementById('history').innerText = history.filter(e => calculate(e) == sum && e != value);
    if (document.getElementById('history').innerText.length < 1) {
        document.getElementById('history').innerText = ' אין מילים שמתאימות לגימטריא זו';
    }
    let cleanValue = clean(value);
    if (sum > 0 && value.length > 1) history.push(cleanValue);
    // console.log('history:', history);
    localStorage.setItem('history', history.join('%%'));

    addToTheTable(sum);


}

function setListOfNumbersInTora(gemOfTorah, perek) {
    if (perek.he) {
        perek.he.forEach((e, index) => {
            const sourcePasuk = addIndexPasuk(index + 1);
            wordsOfPasuk = e.split(' ');
            for (let i = 0; i < wordsOfPasuk.length; i++) {
                for (let j = i + 1; j <= wordsOfPasuk.length; j++) {
                    let words = wordsOfPasuk.slice(i, j);
                    if (words.length) {
                        let word = words.join(' ');
                        word = clean(word);
                        let dict = {};
                        dict[word] = perek.heRef + sourcePasuk; 
                        if (!gemOfTorah[calculate(word)]) {
                            gemOfTorah[calculate(word)] = [];
                        }
                        // console.log('word:', word, rejects(word) );
                        wordWithoutNikud = rejects(word);
                        gemOfTorah[calculate(word)] = gemOfTorah[calculate(word)].filter(w => rejects(Object.keys(w)[0]) != wordWithoutNikud);
                        gemOfTorah[calculate(word)].push(dict);
                    }
                }
            }
        });
    }
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
        torahValues.forEach((dict) => {
            const word = Object.keys(dict)[0];
            const value = dict[word];

            let newRow = tableRef.insertRow(-1);

            let sourceCell = newRow.insertCell(0);
            let wordCell = newRow.insertCell(1);


            let sourceText = document.createTextNode(value);
            let wordText = document.createTextNode(word);

            sourceCell.appendChild(sourceText);
            wordCell.appendChild(wordText);

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
