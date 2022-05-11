var san = require('san');
var XP = san.defineComponent({
    id: 'default',
    template: '<p><slot/></p>'
});

module.exports = XP;