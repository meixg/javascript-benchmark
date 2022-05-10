const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e6],
    type: ['plain', 'nested']
});

function aaa(ctx) {
    return 'a' + ctx.slots.bbb(ctx) + ctx.data.a;
}
function bbb(ctx) {
    return 'b' + ctx.slots.ccc(ctx) + ctx.data.a;
}
function ccc(ctx) {
    return 'c' + ctx.slots.ddd(ctx) + ctx.data.a;
}
function ddd(ctx) {
    return 'd' + ctx.slots.eee(ctx) + ctx.data.a;
}
function eee(ctx) {
    return 'e' + ctx.slots.fff(ctx) + ctx.data.a;
}
function fff(ctx) {
    return 'f' + ctx.slots.ggg(ctx) + ctx.data.a;
}
function ggg(ctx) {
    return 'g' + ctx.slots.hhh(ctx) + ctx.data.a;
}
function hhh(ctx) {
    return 'h' + ctx.slots.iii(ctx) + ctx.data.a;
}
function iii(ctx) {
    return 'i' + ctx.slots.jjj(ctx) + ctx.data.a;
}
function jjj(ctx) {
    return 'j' + ctx.data.a;
}

function main({ type, n }) {
    const data = {a: '0'};
    switch (type) {
        case 'nested':
            bench.start();
            for (let i = 0; i < n; i++) {
                const ctx = {data};
                function aa() {
                    function bb() {
                        function cc() {
                            function dd() {
                                function ee() {
                                    function ff() {
                                        function gg() {
                                            function hh() {
                                                function ii() {
                                                    function jj() {
                                                        return 'j' + ctx.data.a;
                                                    }
                                                    return 'i' + jj() + ctx.data.a;
                                                }
                                                return 'h' + ii() + ctx.data.a;
                                            }
                                            return 'g' + hh() + ctx.data.a;
                                        }
                                        return 'f' + gg() + ctx.data.a;
                                    }
                                    return 'e' + ff() + ctx.data.a;
                                }
                                return 'd' + ee() + ctx.data.a;
                            }
                            return 'c' + dd() + ctx.data.a;
                        }
                        return 'b' + cc() + ctx.data.a;
                    }
                    return 'a' + bb() + ctx.data.a;
                }
                const res = aa();
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
                    aaa: aaa.bind(undefined, ctx),
                    bbb: bbb,
                    ccc: ccc,
                    ddd: ddd,
                    eee: eee,
                    fff: fff,
                    ggg: ggg,
                    hhh: hhh,
                    iii: iii,
                    jjj: jjj
                }
                ctx.slots = slots;
                const res = ctx.slots.aaa();
            }
            bench.end(n);
            break;
    }
}
