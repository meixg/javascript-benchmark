const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e5],
    type: ['for iterate', 'filter + join', 'reduce']
});

const arr = new Array(100).fill(0).map(item => {
    return Math.random() > 0.5 ? undefined : Math.random();
});

function main({ type, n }) {
    switch (type) {
        case 'for iterate':
            bench.start();
            for (let i = 0; i < n; i++) {
                let res = '';
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] !== undefined) {
                        if (i !== 0) {
                            res += ',';
                        }
                        res += arr[i];
                    }
                }
            }
            bench.end(n);
            break;
        case 'filter + join':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = arr.filter(item => item !== undefined).join(',');
            }
            bench.end(n);
            break;
        case 'reduce':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = arr.reduce((acc, item) => item !== undefined ? acc + ',' + item : acc, '');
            }
            bench.end(n);
            break;
    }
}
