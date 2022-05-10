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
        return 'c' + ctx.slots.ddd[""]() + ctx.data.a;
    }
}
const ddd = {
    "": function (ctx) {
        return 'd' + ctx.slots.eee[""]() + ctx.data.a;
    }
}
const eee = {
    "": function (ctx) {
        return 'e' + ctx.slots.fff[""]() + ctx.data.a;
    }
}
const fff = {
    "": function (ctx) {
        return 'f' + ctx.slots.ggg[""]() + ctx.data.a;
    }
}
const ggg = {
    "": function (ctx) {
        return 'g' + ctx.slots.hhh[""]() + ctx.data.a;
    }
}
const hhh = {
    "": function (ctx) {
        return 'h' + ctx.slots.iii[""]() + ctx.data.a;
    }
}
const iii = {
    "": function (ctx) {
        return 'i' + ctx.slots.jjj[""]() + ctx.data.a;
    }
}
const jjj = {
    "": function (ctx) {
        return 'j' + ctx.data.a;
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
                                        const dd = {
                                            "": function () {
                                                const ee = {
                                                    "": function () {
                                                        const ff = {
                                                            "": function () {
                                                                const gg = {
                                                                    "": function () {
                                                                        const hh = {
                                                                            "": function () {
                                                                                const ii = {
                                                                                    "": function () {
                                                                                        const jj = {
                                                                                            "": function () {
                                                                                                return 'j' + ctx.data.a;
                                                                                            }
                                                                                        }
                                                                                        return 'i' + jj[""]() + ctx.data.a;
                                                                                    }
                                                                                }
                                                                                return 'h' + ii[""]() + ctx.data.a;
                                                                            }
                                                                        }
                                                                        return 'g' + hh[""]() + ctx.data.a;
                                                                    }
                                                                }
                                                                return 'f' + gg[""]() + ctx.data.a;
                                                            }
                                                        }
                                                        return 'e' + ff[""]() + ctx.data.a;
                                                    }
                                                }
                                                return 'd' + ee[""]() + ctx.data.a;
                                            }
                                        }
                                        return 'c' + dd[""]() + ctx.data.a;
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
                    ddd: {"": ddd[""].bind(undefined, ctx)},
                    eee: {"": eee[""].bind(undefined, ctx)},
                    fff: {"": fff[""].bind(undefined, ctx)},
                    ggg: {"": ggg[""].bind(undefined, ctx)},
                    hhh: {"": hhh[""].bind(undefined, ctx)},
                    iii: {"": iii[""].bind(undefined, ctx)},
                    jjj: {"": jjj[""].bind(undefined, ctx)}
                }
                ctx.slots = slots;
                const res = ctx.slots.aaa[""]();
                // console.log(res);
            }
            bench.end(n);
            break;
    }
}
