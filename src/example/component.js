var san = require('san');
var XP = require('./component2');
var XA = require('./c');

var MyComponent = san.defineComponent({
    components: {
        'x-p': XP,
        'x-a': XA
    },
    template: '<div><x-a s-for="item in list"><x-p>{{ item }}</x-p></x-a></div>'
});

exports = module.exports = MyComponent;
