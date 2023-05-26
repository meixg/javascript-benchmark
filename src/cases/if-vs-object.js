const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e8],
    type: ['if', 'object']
});

const keyMap = {
    a: 'aaa',
    b: 'bbb',
    c: 'ccc'
};
const key = 'ccc';

function main({ type, n }) {
    let res;
    switch(type) {
        case 'if':
            bench.start();
            if (key === keyMap.a) {
                res = 'aa';
            } 
            if (key === keyMap.b) {
                res = 'bb';
            }
            if (key === keyMap.c) {
                res = 'cc';
            }
            bench.end(1);
            break;
        case 'object':
            bench.start();
            res = {
                [keyMap.a]: 'aa',
                [keyMap.b]: 'bb',
                [keyMap.c]: 'cc'
            }[key];
            bench.end(1);
    }
    return res;
}
