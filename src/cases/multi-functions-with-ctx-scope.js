const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e6],
    type: ['plain', 'nested']
});

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
                // console.log(res);
            }
            bench.end(n);
            break;
        case 'plain':
            bench.start();
            for (let i = 0; i < n; i++) {
                const ctx = {data};
                function aaa() {
                    return 'a' + bbb() + ctx.data.a;
                }
                function bbb() {
                    return 'b' + ccc() + ctx.data.a;
                }
                function ccc() {
                    return 'c' + ddd() + ctx.data.a;
                }
                function ddd() {
                    return 'd' + eee() + ctx.data.a;
                }
                function eee() {
                    return 'e' + fff() + ctx.data.a;
                }
                function fff() {
                    return 'f' + ggg() + ctx.data.a;
                }
                function ggg() {
                    return 'g' + hhh() + ctx.data.a;
                }
                function hhh() {
                    return 'h' + iii() + ctx.data.a;
                }
                function iii() {
                    return 'i' + jjj() + ctx.data.a;
                }
                function jjj() {
                    return 'j' + ctx.data.a;
                }
                const res = aaa();
                // console.log(res);
            }
            bench.end(n);
            break;
    }
}
