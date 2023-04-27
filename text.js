const arrayOfObjects = [];

const vals = [50, 96598, 500, 3000, 5500];

vals.forEach(element => {
    const object = {};
    object[element] = 'num: ' +element;
    console.log(object);
    switchObject(element, object);
});

console.log(arrayOfObjects);





function switchObject(result, object) {
    for (let i = 1; i < 2000; i = i + 100) {
        const n = Math.floor(i / 100);
        if (result < i) {
            if (!arrayOfObjects[n]) {
                arrayOfObjects[n] = [];
            }
           arrayOfObjects[n].push(object);
        }
        
    }
}