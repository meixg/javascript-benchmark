const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e6],
    type: ['"" + value', 'value + ""', 'String(value)']
});

const arr = new Array(100).fill(0).map(item => Math.random() * 10000);

function main({ type, n }) {
    switch (type) {
        case '"" + value':
            bench.start();
            for (let i = 0; i < n; i++) {
                for (let i = 0; i < arr.length; i++) {
                    '' + arr[i];
                }
            }
            bench.end(n);
            break;
        case 'value + ""':
            bench.start();
            for (let i = 0; i < n; i++) {
                for (let i = 0; i < arr.length; i++) {
                    arr[i] + '';
                }
            }
            bench.end(n);
            break;
        case 'String(value)':
            bench.start();
            for (let i = 0; i < n; i++) {
                for (let i = 0; i < arr.length; i++) {
                    String(arr[i]);
                }
            }
            bench.end(n);
            break;
    }
}
