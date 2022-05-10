const {createSuite, runSuite} = require('../utils/benchmarkify');

const suite = createSuite('multi-functions', {minSamples: 1000000});

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
suite.add('plain', () => {
    const res = aaa() + bbb() + ccc() + ddd() + eee() + fff() + ggg() + hhh() + iii() + jjj();
});

suite.add('nested', () => {
    const res = aa();
});

setTimeout(() => {
    runSuite(suite);
}, 0);
