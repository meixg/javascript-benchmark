const common = require('../utils/common');
const renderPlain = require('./slot-func-next-plain-real/plain/component');
const renderNested = require('./slot-func-next-plain-real/nested/component');
const Component = require('./slot-func-next-plain-real/component');

const bench = common.createBenchmark(main, {
    n: [1e3],
    // n: [1],
    // type: ['plain', 'nested', 'plain-global-ctx', 'plain-real']
    type: ['nested', 'plain']
});

const data = [];
for (let i = 0; i < 10; i++) {
    data.push(Math.random() * 10000);
}

function main({ type, n }) {
    switch (type) {
        case 'plain':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = renderPlain({list: data}, {ComponentClass: Component});
                // console.log(res);
            }
            bench.end(n);
            break;
        case 'nested':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = renderNested({list: data}, {ComponentClass: Component});
                // console.log(res);
            }
            bench.end(n);
            break;
    }
}