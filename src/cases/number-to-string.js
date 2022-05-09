const {createSuite, runSuite} = require('../utils/benchmarkify');

const suite = createSuite('number-to-string', {minSamples: 100000});
const arr = new Array(100).fill(0).map(item => Math.random() * 10000);

suite.add('"" + value', () => {
    for (let i = 0; i < arr.length; i++) {
        '' + arr[i];
    }
});

suite.add('String(value)', () => {
    for (let i = 0; i < arr.length; i++) {
        String(arr[i]);
    }
});

setTimeout(() => {
    runSuite(suite);
}, 0);
