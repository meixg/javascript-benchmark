const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    type: ['for', 'for...of', '.forEach'],
    n: [1e6]
});

const arr = new Array(100).fill(0);
function main({ type, n }) {
    switch (type) {
        case 'for':
            bench.start();
            for (let i = 0; i < n; i++) {
                for (let i = 0; i < arr.length; i++) {
                    const a = arr[i];
                }
            }
            bench.end(n);
            break;
        case 'for...of':
            bench.start();
            for (let i = 0; i < n; i++) {
                for (let a of arr) {
                }
            }
            bench.end(n);
            break;
        case '.forEach':
            bench.start();
            for (let i = 0; i < n; i++) {
                arr.forEach(a => {});
            }
            bench.end(n);
            break;
    }
}
