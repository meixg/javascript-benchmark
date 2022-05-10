const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e6],
    type: ['plain', 'nested']
});

const aaa = {
    "": function (ctx) {
        return 'a' + ctx.slots.bbb[""]() + ctx.data.a;
    }
}
const bbb = {
    "": function (ctx) {
        return 'b' + ctx.slots.ccc[""]() + ctx.data.a;
    }
}
const ccc = {
    "": function (ctx) {
        return 'c' + ctx.data.a;
    }
}

function main({ type, n }) {
    const data = {a: '0'};
    switch (type) {
        case 'nested':
            bench.start();
            for (let i = 0; i < n; i++) {
                const ctx = {data};
                const aa = {
                    "": function() {
                        const bb = {
                            "": function () {
                                const cc = {
                                    "": function () {
                                        return 'c' + ctx.data.a;
                                    }
                                }
                                return 'b' + cc[""]() + ctx.data.a;
                            }
                        }
                        return 'a' + bb[""]() + ctx.data.a;
                    }
                }
                const res = aa[""]();
                // console.log(res);
            }
            bench.end(n);
            break;
        case 'plain':
            bench.start();
            for (let i = 0; i < n; i++) {
                const ctx = {
                    data,
                    slots: {}
                };
                const slots = {
                    aaa: {"": aaa[""].bind(undefined, ctx)},
                    bbb: {"": bbb[""].bind(undefined, ctx)},
                    ccc: {"": ccc[""].bind(undefined, ctx)},
                }
                ctx.slots = slots;
                const res = ctx.slots.aaa[""]();
                // console.log(res);
            }
            bench.end(n);
            break;
    }
}
