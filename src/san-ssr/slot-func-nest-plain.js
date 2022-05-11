const common = require('../utils/common');
const renderPlain = require('../example/plain/component');
const renderNested = require('../example/nested/component');
const Component = require('../example/component');

const bench = common.createBenchmark(main, {
    n: [1e3],
    type: ['plain', 'nested']
});

const data = [];
for (let i = 0; i < 100; i++) {
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