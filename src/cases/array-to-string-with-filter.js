const {createSuite, runSuite} = require('../utils/benchmarkify');

const suite = createSuite('array-to-string-with-filter', {minSamples: 100000});
const arr = new Array(100).fill(0).map(item => {
    return Math.random() > 0.5 ? undefined : Math.random();
});

suite.add('for iterate', () => {
    let res = '';
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            if (i !== 0) {
                res += ',';
            }
            res += arr[i];
        }
    }
});

suite.add('filter + join', () => {
    const res = arr.filter(item => item !== undefined).join(',');
});

setTimeout(() => {
    runSuite(suite);
}, 0);