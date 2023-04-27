BASE_URL = "https://www.sefaria.org/api/texts/";
PARAMS = "?ven=The_Contemporary_Torah,_Jewish_Publication_Society,_2006&vhe=Miqra_according_to_the_Masorah&lang=he&aliyot=0"
CHUMASHIM = [{ 'Genesis.': 50 }, { 'shmot.': 40 }, { 'vaikra.': 27 }, { 'bamidbar.': 36 }, { 'dvarim.': 34 }];
const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

Object.keys(VAL).forEach(function(key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
  });

