const common = require('../utils/common');

const bench = common.createBenchmark(main, {
    n: [1e8],
    type: ['plain', 'nested']
});

function aaa() {
    return 'a';
}
function bbb() {
    return 'b';
}
function ccc() {
    return 'c';
}
function ddd() {
    return 'd';
}
function eee() {
    return 'e';
}
function fff() {
    return 'f';
}
function ggg() {
    return 'g';
}
function hhh() {
    return 'h';
}
function iii() {
    return 'i';
}
function jjj() {
    return 'j';
}

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
                                        return 'j';
                                    }
                                    return 'i' + jj();
                                }
                                return 'h' + ii();
                            }
                            return 'g' + hh();
                        }
                        return 'f' + gg();
                    }
                    return 'e' + ff();
                }
                return 'd' + ee();
            }
            return 'c' + dd();
        }
        return 'b' + cc();
    }

    return 'a' + bb();
}

function main({ type, n }) {
    switch (type) {
        case 'nested':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = aa();
            }
            bench.end(n);
            break;
        case 'plain':
            bench.start();
            for (let i = 0; i < n; i++) {
                const res = aaa() + bbb() + ccc() + ddd() + eee() + fff() + ggg() + hhh() + iii() + jjj();
            }
            bench.end(n);
            break;
    }
}
