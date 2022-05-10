const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e8],
    type: ['create', 'reference obj property', 'plain reference']
});

const obj = {
    a: {aaa: 123, bbb: 456},
};
const obj1 = {aaa: 123, bbb: 456};
function aaa(obj) {
    return obj.aaa;
}

function main({ type, n }) {
    switch (type) {
        case 'create':
            bench.start();
            for (let i = 0; i < n; i++) {
                aaa({aaa: 123, bbb: 456});
            }
            bench.end(n);
            break;
        case 'reference obj property':
            bench.start();
            for (let i = 0; i < n; i++) {
                aaa(obj.a);
            }
            bench.end(n);
            break;
        case 'plain reference':
            bench.start();
            for (let i = 0; i < n; i++) {
                aaa(obj1);
            }
            bench.end(n);
            break;
    }
}
