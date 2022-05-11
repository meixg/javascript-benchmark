const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e6],
    type: ['plain', 'nested']
});

let ctx;
function setGlobalCtx(c) {
    ctx = c;
}
const aaa = {
    "": function () {
        return 'a' + bbb[""]() + ctx.data.a;
    }
}
const bbb = {
    "": function () {
        return 'b' + ccc[""]() + ctx.data.a;
    }
}
const ccc = {
    "": function () {
        return 'c' + ddd[""]() + ctx.data.a;
    }
}
const ddd = {
    "": function () {
        return 'd' + eee[""]() + ctx.data.a;
    }
}
const eee = {
    "": function () {
        return 'e' + fff[""]() + ctx.data.a;
    }
}
const fff = {
    "": function () {
        return 'f' + ggg[""]() + ctx.data.a;
    }
}
const ggg = {
    "": function () {
        return 'g' + hhh[""]() + ctx.data.a;
    }
}
const hhh = {
    "": function () {
        return 'h' + iii[""]() + ctx.data.a;
    }
}
const iii = {
    "": function () {
        return 'i' + jjj[""]() + ctx.data.a;
    }
}
const jjj = {
    "": function () {
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
                setGlobalCtx(ctx);
                const res = aaa[""]();
                // console.log(res);
            }
            bench.end(n);
            break;
    }
}
