const {createSuite, runSuite} = require('../utils/benchmarkify');

const suite = createSuite('array-to-string', {minSamples: 100000});
const arr = new Array(100).fill(0).map(item => Math.random());

suite.add('for iterate', () => {
    let res = '';
    for (let i = 0; i < arr.length; i++) {
        res += arr[i] + '-' + arr[i];
    }
});

suite.add('map + join', () => {
    const res = arr.map(item => item + '-' + item).join('');
});

suite.add('reduce', () => {
    const res = arr.reduce((acc, item) => acc + item + '-' + item, '');
});

setTimeout(() => {
    runSuite(suite);
}, 0);