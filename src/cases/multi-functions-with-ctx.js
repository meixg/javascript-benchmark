const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e6],
    type: ['plain', 'nested']
});

function aaa(ctx) {
    return 'a' + ctx.slots.bbb() + ctx.data.a;
}
function bbb(ctx) {
    return 'b' + ctx.slots.ccc() + ctx.data.a;
}
function ccc(ctx) {
    return 'c' + ctx.slots.ddd() + ctx.data.a;
}
function ddd(ctx) {
    return 'd' + ctx.slots.eee() + ctx.data.a;
}
function eee(ctx) {
    return 'e' + ctx.slots.fff() + ctx.data.a;
}
function fff(ctx) {
    return 'f' + ctx.slots.ggg() + ctx.data.a;
}
function ggg(ctx) {
    return 'g' + ctx.slots.hhh() + ctx.data.a;
}
function hhh(ctx) {
    return 'h' + ctx.slots.iii() + ctx.data.a;
}
function iii(ctx) {
    return 'i' + ctx.slots.jjj() + ctx.data.a;
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
                    bbb: bbb.bind(undefined, ctx),
                    ccc: ccc.bind(undefined, ctx),
                    ddd: ddd.bind(undefined, ctx),
                    eee: eee.bind(undefined, ctx),
                    fff: fff.bind(undefined, ctx),
                    ggg: ggg.bind(undefined, ctx),
                    hhh: hhh.bind(undefined, ctx),
                    iii: iii.bind(undefined, ctx),
                    jjj: jjj.bind(undefined, ctx)
                }
                ctx.slots = slots;
                const res = ctx.slots.aaa();
            }
            bench.end(n);
            break;
    }
}
