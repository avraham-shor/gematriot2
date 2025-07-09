let gemOfTorah = {};
let option = 1;
let source = 1;

// Add new function for search button
function performSearch() {
    const value = document.getElementById("chars").value;
    if (!value || value.trim() === '') {
        showNotification('אנא הכנס מילה או מילים לחיפוש', 'warning');
        return;
    }
    
    // Hide source and options sections when search is performed
    hideSourceAndOptions();
    
    showLoading(true);
    main().finally(() => {
        showLoading(false);
    });
}

// Function to hide source and options sections with beautiful effects
function hideSourceAndOptions() {
    const sourceSection = document.querySelector('.source-section');
    const optionsSection = document.querySelector('.options-section');
    
    // Set global flag to track hidden state
    window.sectionsHidden = true;
    
    // Choose a random effect for variety
    const effects = ['slide-up', 'scale-out', 'rotate-out'];
    const sourceEffect = effects[Math.floor(Math.random() * effects.length)];
    const optionsEffect = effects[Math.floor(Math.random() * effects.length)];
    
    if (sourceSection) {
        sourceSection.classList.add(`section-${sourceEffect}`);
        setTimeout(() => {
            sourceSection.style.display = 'none';
            sourceSection.classList.remove(`section-${sourceEffect}`);
        }, 500);
    }
    
    if (optionsSection) {
        // Add slight delay for staggered effect
        setTimeout(() => {
            optionsSection.classList.add(`section-${optionsEffect}`);
            setTimeout(() => {
                optionsSection.style.display = 'none';
                optionsSection.classList.remove(`section-${optionsEffect}`);
            }, 500);
        }, 100);
    }
}

// Function to show source and options sections with beautiful effects
function showSourceAndOptions() {
    const sourceSection = document.querySelector('.source-section');
    const optionsSection = document.querySelector('.options-section');
    
    // Set global flag to track visible state
    window.sectionsHidden = false;
    
    // Choose a random effect for variety
    const effects = ['slide-down', 'scale-in', 'rotate-in'];
    const sourceEffect = effects[Math.floor(Math.random() * effects.length)];
    const optionsEffect = effects[Math.floor(Math.random() * effects.length)];
    
    if (sourceSection) {
        sourceSection.style.display = 'block';
        sourceSection.classList.add(`section-${sourceEffect}`);
        setTimeout(() => {
            sourceSection.classList.remove(`section-${sourceEffect}`);
        }, 500);
    }
    
    if (optionsSection) {
        // Add slight delay for staggered effect
        setTimeout(() => {
            optionsSection.style.display = 'block';
            optionsSection.classList.add(`section-${optionsEffect}`);
            setTimeout(() => {
                optionsSection.classList.remove(`section-${optionsEffect}`);
            }, 500);
        }, 150);
    }
}

// Loading overlay functions
function showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById("chars");
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Add click event listener to show sections when clicking anywhere
    document.addEventListener('click', function(event) {
        // Don't show if clicking on search button (to avoid immediate hide/show)
        if (event.target.closest('.search-button')) {
            return;
        }
        
        // Show sections if they are hidden
        if (window.sectionsHidden) {
            showSourceAndOptions();
        }
    });
    
    // Add input event listener to show sections when typing
    inputField.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length > 0 && window.sectionsHidden) {
            showSourceAndOptions();
        }
    });
    
    // Set initial state
    setColorButtons(1, [document.getElementById("btn1"), document.getElementById("btn2"), document.getElementById("btn3")]);
    setColorButtons(1, [document.getElementById("hedderBtn1"), document.getElementById("hedderBtn2"), document.getElementById("hedderBtn3"), document.getElementById("hedderBtn4"), document.getElementById("hedderBtn5")]);
    
    // Focus on input field for better UX
    inputField.focus();
    
    // Add notification styles
    addNotificationStyles();
});

// Add notification styles dynamically
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-info {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        
        .notification-warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        
        .notification-success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .notification-error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
        }
        
        .notification-message {
            flex: 1;
            margin-left: 8px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

async function main() {
    // Check if required data is loaded
    if (source === 2 && !window.dataLoaded?.nevihim) {
        showNotification('נתוני נביאים עדיין נטענים, אנא המתן...', 'warning');
        return;
    }
    if (source === 3 && !window.dataLoaded?.cetuvim) {
        showNotification('נתוני כתובים עדיין נטענים, אנא המתן...', 'warning');
        return;
    }
    
    const value = document.getElementById("chars").value;
    const sum = calculate(value);
    
    // Update gematria display
    const sumElement = document.getElementById('sum');
    if (sumElement) {
        sumElement.innerText = sum;
        // Show the gematria display
        document.getElementById('gematriaDisplay').style.display = 'block';
    }
    
    const hedderBtn1 = document.getElementById("hedderBtn1");
    const hedderBtn2 = document.getElementById("hedderBtn2");
    const hedderBtn3 = document.getElementById("hedderBtn3");
    const hedderBtn4 = document.getElementById("hedderBtn4");
    const hedderBtn5 = document.getElementById("hedderBtn5");
    let obj = {};
    let objSource = {};
    let objRoshei = {};
    let objSofei = {};
    switch (source) {
        case 1:
            obj = gemTora;
            objSource = await gemSourceTora || {};
            objRoshei = gemRoshei['tora'] || {};
            objSofei = gemSofei['tora'] || {};
            hedderBtn1.innerText = "גימטריה בתורה";
            hedderBtn2.innerText = "מילים בתורה";
            hedderBtn3.innerText = 'פסוקים לשמות אנשים בתורה';
            hedderBtn4.innerText = 'ראשי תיבות בתורה';
            hedderBtn5.innerText = 'סופי תיבות בתורה';
            break;
        case 2:
            obj = gemNevihim;
            objSource = await gemSourceNevihim || {};
            objRoshei = gemRoshei['nevihim'] || {};
            objSofei = gemSofei['nevihim'] || {};
            hedderBtn1.innerText = "גימטריה בנביאים";
            hedderBtn2.innerText = "מילים בנביאים";
            hedderBtn3.innerText = 'פסוקים לשמות אנשים בנביאים';
            hedderBtn4.innerText = 'ראשי תיבות בנביאים';
            hedderBtn5.innerText = 'סופי תיבות בנביאים';
            break;
        case 3:
            obj = gemCetuvim;
            objSource = await gemSourceCetuvim || {};
            objRoshei = gemRoshei['cetuvim'] || {};
            objSofei = gemSofei['cetuvim'] || {};
            hedderBtn1.innerText = "גימטריה בכתובים";
            hedderBtn2.innerText = "מילים בכתובים";
            hedderBtn3.innerText = 'פסוקים לשמות אנשים בכתובים';
            hedderBtn4.innerText = 'ראשי תיבות בכתובים';
            hedderBtn5.innerText = 'סופי תיבות בכתובים';
            break;
        default:
            obj = gemTora;
            objSource = await gemSourceTora || {};
            objRoshei = gemRoshei['tora'] || {};
            objSofei = gemSofei['tora'] || {};
            hedderBtn1.innerText = "גימטריה בתורה";
            hedderBtn2.innerText = "מילים בתורה";
            hedderBtn3.innerText = 'פסוקים לשמות אנשים בתורה';
            hedderBtn4.innerText = 'ראשי תיבות בתורה';
            hedderBtn5.innerText = 'סופי תיבות בתורה';
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
        case 5:
            setSofeiTeivot(value, obj, objSofei)
            break;
        default:
            setGematrya(value)
            break;
    }
}

function setGematrya(value, sum, obj, objSource) {
    document.getElementById("subject").innerText = "מילים עם אותה גימטריה";
    setGematriaRows(sum, obj, objSource)
}

function setHistory(sum, value) {
    let history = [];
    localStorage.getItem('history') ? history = localStorage.getItem('history').split('%%') : [];
    history = history.filter((v, i) => history.indexOf(v) === i).sort();
    
    const historyElement = document.getElementById('history');
    const historySection = document.getElementById('historySection');
    
    const filteredHistory = history.filter(e => calculate(e) == sum && e != value);
    if (filteredHistory.length > 0) {
        historyElement.innerText = filteredHistory.join(', ');
        historySection.classList.remove('hide');
    } else {
        historySection.classList.add('hide');
    }
    
    let cleanValue = clean(value);
    if (sum > 0 && value.length > 1) history.push(cleanValue + " ");
    localStorage.setItem('history', history.join('%%'));
}

function setOption(value) {
    option = value;
    const hedderBtn1 = document.getElementById("hedderBtn1");
    const hedderBtn2 = document.getElementById("hedderBtn2");
    const hedderBtn3 = document.getElementById("hedderBtn3");
    const hedderBtn4 = document.getElementById("hedderBtn4");
    const hedderBtn5 = document.getElementById("hedderBtn5");

    const buttons = [hedderBtn1, hedderBtn2, hedderBtn3, hedderBtn4, hedderBtn5];
    setColorButtons(value, buttons);
    // main(); // Removed automatic search
}

function setColorButtons(source, buttons) {
    let nonSelects = getArrRange(1, buttons.length).filter(num => num != source);
    nonSelects.forEach(num => {
        buttons[num - 1].classList.remove("active");
    });
    buttons[source - 1].classList.add("active");
}

function setSource(value) {
    source = value;
    const hedderBtn1 = document.getElementById("btn1");
    const hedderBtn2 = document.getElementById("btn2");
    const hedderBtn3 = document.getElementById("btn3");
    const buttons = [hedderBtn1, hedderBtn2, hedderBtn3];
    setColorButtons(source, buttons);

    // עדכון שמות כפתורי סוגי החיפוש
    const optionBtn1 = document.getElementById("hedderBtn1");
    const optionBtn2 = document.getElementById("hedderBtn2");
    const optionBtn3 = document.getElementById("hedderBtn3");
    const optionBtn4 = document.getElementById("hedderBtn4");
    const optionBtn5 = document.getElementById("hedderBtn5");
    
    switch (value) {
        case 1:
            optionBtn1.innerText = "גימטריה בתורה";
            optionBtn2.innerText = "מילים בתורה";
            optionBtn3.innerText = 'פסוקים לשמות אנשים בתורה';
            optionBtn4.innerText = 'ראשי תיבות בתורה';
            optionBtn5.innerText = 'סופי תיבות בתורה';
            break;
        case 2:
            optionBtn1.innerText = "גימטריה בנביאים";
            optionBtn2.innerText = "מילים בנביאים";
            optionBtn3.innerText = 'פסוקים לשמות אנשים בנביאים';
            optionBtn4.innerText = 'ראשי תיבות בנביאים';
            optionBtn5.innerText = 'סופי תיבות בנביאים';
            break;
        case 3:
            optionBtn1.innerText = "גימטריה בכתובים";
            optionBtn2.innerText = "מילים בכתובים";
            optionBtn3.innerText = 'פסוקים לשמות אנשים בכתובים';
            optionBtn4.innerText = 'ראשי תיבות בכתובים';
            optionBtn5.innerText = 'סופי תיבות בכתובים';
            break;
        default:
            optionBtn1.innerText = "גימטריה בתורה";
            optionBtn2.innerText = "מילים בתורה";
            optionBtn3.innerText = 'פסוקים לשמות אנשים בתורה';
            optionBtn4.innerText = 'ראשי תיבות בתורה';
            optionBtn5.innerText = 'סופי תיבות בתורה';
            break;
    }
    // main(); // Removed automatic search
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
                        const rejectedWord = rejects(word);
                        //check which words in the Pasuk are the same text
                        if (word.length && (value.includes(rejectedWord) || rejectedWord.includes(value))) {
                            // debugger;
                            mainWords.push(word);
                        }
                        else if (mainWords.length) break;
                    }
                    // if (mainWords.length) {
                        let selectWords = mainWords && mainWords.join(" ") || "";
                        if (value != rejects(selectWords)) {
                            selectWords = CheckAgainThoroughly(pasuk, value);
                        }
                        const arr = pasuk.split(selectWords);
                        const rightOfPasuk = arr[0];
                        const leftOfPasuk = arr[1];
                        listOfSamePesukim.push([rightOfPasuk, selectWords, leftOfPasuk, seferName + " " + addIndexInHebrew(indexPerek + 1) + addIndexInHebrew(indexPasuk + 1)]);

                    // }

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

function fillTable(listOfSamePesukim) {
    let tableTheSame = document.getElementById("table");
    // Clear existing tbody rows
    const tbody = tableTheSame.querySelector('tbody');
    tbody.innerHTML = '';

    // Detect if this is a Roshei Teivot result (by a custom property on the array)
    const isRosheiTeivot = listOfSamePesukim.rosheiTeivot === true;

    listOfSamePesukim.forEach((arrayOfPasuk, index) => {
        let newRow = tbody.insertRow();
        let counterCell = newRow.insertCell(0);
        let sourceCell = newRow.insertCell(1);
        let pasukCell = newRow.insertCell(2);

        counterCell.className = "col-number";
        sourceCell.className = "col-source";
        pasukCell.className = "col-content pesukim";

        let counterText = document.createTextNode(index + 1);
        let sourceText = document.createTextNode(arrayOfPasuk[3]);
        counterCell.appendChild(counterText);
        sourceCell.appendChild(sourceText);

        // If Roshei Teivot, highlight only first letter of each matching word
        if (isRosheiTeivot && arrayOfPasuk[1]) {
            pasukCell.appendChild(document.createTextNode(arrayOfPasuk[0]));
            const words = arrayOfPasuk[1].split(' ');
            words.forEach((word, i) => {
                if (word && word.length > 0) {
                    const span = document.createElement('span');
                    span.className = 'highlighted-word';
                    span.textContent = word[0];
                    pasukCell.appendChild(span);
                    if (word.length > 1) {
                        pasukCell.appendChild(document.createTextNode(word.slice(1)));
                    }
                    if (i < words.length - 1) {
                        pasukCell.appendChild(document.createTextNode(' '));
                    }
                }
            });
            pasukCell.appendChild(document.createTextNode(arrayOfPasuk[2]));
        } else {
            // Default: highlight the whole match
            const wordSpan = document.createElement("span");
            wordSpan.className = "highlighted-word";
            wordSpan.textContent = arrayOfPasuk[1];
            pasukCell.appendChild(document.createTextNode(arrayOfPasuk[0]));
            pasukCell.appendChild(wordSpan);
            pasukCell.appendChild(document.createTextNode(arrayOfPasuk[2]));
        }
    });
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
        seferRoshei.forEach((perekRoshei, indexPerek) => {
            if (perekRoshei.includes(value)) {
                let numWordsBefore = perekRoshei.split(value)[0].length;
                let selectWords = "";
                let right;
                let left;
                let valueLength = value.length;
                let pasukIndex;
                let lastPasukIndex;
                let firstIndex;
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
                        if (wordsOfPasuk.length - numWordsBefore >= valueLength) {
                         end = numWordsBefore + valueLength; 
                        }
                        if (valueLength > 0) {
                            if (!right) {
                                right = wordsOfPasuk.slice(0, numWordsBefore).join(" ") + " ";
                            }
                            if (end) {
                                left = " " + wordsOfPasuk.slice(end).join(" ");
                            }
                            // Instead of joining, keep as array for highlighting
                            let matchedWords = wordsOfPasuk.slice(numWordsBefore, end);
                            selectWords = matchedWords.join(" ");
                            valueLength -= matchedWords.length;
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
    // Mark this result as Roshei Teivot for fillTable
    listOfRosheiTeivot.rosheiTeivot = true;
    fillTable(listOfRosheiTeivot);
}

function setSofeiTeivot(value, obj, objSofei) {
    const listOfSofeiTeivot = [];
    // Replace the endChars to simple chars.
    value = value.replaceAll(/\s+/g, "").replaceAll("ך", "כ").replaceAll("ם", "מ")
    .replaceAll("ן", "נ").replaceAll("ף", "פ").replaceAll("ץ", "צ");

    document.getElementById("subject").innerText = "מילים המסתיימות עם האותיות האלו";
    if (value.length) {
        for (const [k, v] of Object.entries(objSofei)) {
        const seferName = k;
        const seferRoshei = v;
        // console.log(seferRoshei);
        seferRoshei.forEach((perekSofei, indexPerek) => {
            if (perekSofei.includes(value)) {
                let numWordsBefore = perekSofei.split(value)[0].length;
                let selectWords = "";
                let right;
                let left;
                console.log(seferName, indexPerek);
                let valueLength = value.length;
                let pasukIndex;
                let lastPasukIndex;
                let firstIndex;
                // console.log(perekSofei);
                obj[seferName][indexPerek].forEach((pasuk, index) => {
                    wordsOfPasuk = pasuk.replaceAll("־"," ").replaceAll(" ׀","").split(" ").filter(word => word.length);

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
                        if (wordsOfPasuk.length - numWordsBefore >= valueLength) {
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
                listOfSofeiTeivot.push([right, selectWords, left, seferName + " " + addIndexInHebrew(indexPerek + 1) + pasukIndex + lastPasukIndex]);
            }
        });
     }
    }
    if (!listOfSofeiTeivot.length) {
        listOfSofeiTeivot.push(['', 'אין מילים המסתיימות עם האותיות האלו', '', 'אין מקורות']);
    }

    fillTable(listOfSofeiTeivot);
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