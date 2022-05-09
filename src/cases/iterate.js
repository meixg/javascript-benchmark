const {createSuite} = require('../utils/benchmarkify');

const suite = createSuite('for...in vs for...of');
const arr = new Array(100).fill(0);

suite.add('for...in', () => {
    for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
    }
});

suite.add('for...of', () => {
    for (let a of arr) {

    }
});

suite.add('.forEach', () => {
    arr.forEach(a => {});
});

suite.run();