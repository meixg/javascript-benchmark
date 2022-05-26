const san = require('san')

const XA = san.defineComponent({
    template: '<a><slot/></a>'
})

const XB = san.defineComponent({
    template: '<a><slot/></a>'
})

const XC = san.defineComponent({
    template: '<a><slot/></a>'
})

const XD = san.defineComponent({
    template: '<a><slot/></a>'
})

const XE = san.defineComponent({
    template: '<a><slot/></a>'
})

const XF = san.defineComponent({
    template: '<a><slot/></a>'
})

const XG = san.defineComponent({
    template: '<a><slot/></a>'
})

const XH = san.defineComponent({
    template: '<a><slot/></a>'
})

const XP = san.defineComponent({
    template: '<p><slot/></p>'
})

const MyComponent = san.defineComponent({
    components: {
        'x-p': XP,
        'x-a': XA,
        'x-b': XB,
        'x-c': XC,
        'x-d': XD,
        'x-e': XE,
        'x-f': XF,
        'x-g': XG,
        'x-h': XH
    },
    initData () {
        return {
            text: 'aaa'
        }
    },
    template: `
    <div>
        <x-p s-for="item in list">
            <x-a>
                {{ text }}
                <x-b>
                    {{ text }}
                    <x-c>
                        {{ text }}
                        <x-d>
                            {{ text }}
                            <x-e>
                                {{ text }}
                                <x-f>
                                    {{ text }}
                                    <x-g>
                                        {{ text }}
                                        <x-h>
                                            {{ text }}{{ item }}
                                        </x-h>
                                    </x-g>
                                </x-f>
                            </x-e>
                        </x-d>
                    </x-c>
                </x-b>
            </x-a>
        </x-p>
    </div>
    `
})

exports = module.exports = MyComponent
