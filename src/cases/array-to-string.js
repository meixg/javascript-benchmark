const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e5],
    type: ['for iterate', 'map + join', 'reduce']
});

const arr = new Array(100).fill(0).map(item => Math.random());

function main({ type, n }) {
    switch (type) {
        case 'for iterate':
            bench.start();
            for (let i = 0; i < n; i++) {
                let res = '';
                for (let i = 0; i < arr.length; i++) {
                    res += arr[i] + '-' + arr[i];
                }
            }
            bench.end(n);
            break;
        case 'map + join':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = arr.map(item => item + '-' + item).join('');
            }
            bench.end(n);
            break;
        case 'reduce':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = arr.reduce((acc, item) => acc + item + '-' + item, '');
            }
            bench.end(n);
            break;
    }
}
