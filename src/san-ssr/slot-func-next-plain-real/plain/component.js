const sanSSRHelpers = (function (exports) {
    "use strict";
    /**
     * 该文件可能会以字符串形式直接输出到产物中
     * 因此不能引用外部模块，会因找不到外部模块报错
     */
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._ = void 0;
    const BASE_PROPS = {
        class: 1,
        style: 1,
        id: 1
    };
    const HTML_ENTITY = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '\u00a0': '&nbsp;',
        '\u2003': '&emsp;',
        '\u2002': '&ensp;',
        '\u2009': '&thinsp;',
        '\xa9': '&copy;',
        '\xae': '&reg;',
        '\u200c': '&zwnj;',
        '\u200d': '&zwj;',
        '&': '&amp;'
    };
    const rENTITY = new RegExp(`[${Object.keys(HTML_ENTITY).join('')}]`, 'g');
    function escapeHTML(source) {
        if (typeof source === 'string') {
            return source.replace(rENTITY, (c) => HTML_ENTITY[c]);
        }
        return source;
    }
    function isObject(source) {
        return typeof source === 'object' && source !== null;
    }
    function isArray(source) {
        return source && source instanceof Array;
    }
    function output(value, needEscape) {
        if (value == null || value === '') {
            return '';
        }
        value = '' + value;
        return needEscape ? escapeHTML(value) : value;
    }
    function classFilter(source) {
        if (!isArray(source)) {
            source = [source];
        }
        let res = '';
        for (let i = 0; i < source.length; i++) {
            const s = source[i];
            if (s != null) {
                if (i !== 0) {
                    res += ' ';
                }
                res += s;
            }
        }
        return res;
    }
    function styleFilter(source) {
        if (isObject(source)) {
            const keys = Object.keys(source);
            let res = '';
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                res += (key + ':' + source[key] + ';');
            }
            return res;
        }
        return source;
    }
    function xclassFilter(inherits, own) {
        const inheritStr = classFilter(inherits);
        if (inheritStr) {
            if (own)
                return own + ' ' + inheritStr;
            return inheritStr;
        }
        return own;
    }
    function xstyleFilter(inherits, own) {
        inherits = inherits && styleFilter(inherits);
        if (inherits) {
            if (own)
                return own + ';' + inherits;
            return inherits;
        }
        return own;
    }
    function attrFilter(name, value, needEscape) {
        // style/class/id 值为 falsy 时不输出属性
        if (value == null || (!value && BASE_PROPS[name])) {
            return '';
        }
        value = '' + value;
        return ` ${name}="${needEscape ? escapeHTML(value) : value}"`;
    }
    function boolAttrFilter(name, value) {
        return value ? ' ' + name : '';
    }
    function callFilter(ctx, name, ...args) {
        let value;
        try {
            value = ctx.instance.filters[name].call(ctx.instance, ...args);
        }
        catch (e) {
            /* istanbul ignore next */
            handleError(e, ctx.instance, 'filter:' + name);
        }
        return value;
    }
    function callComputed(ctx, name) {
        let value;
        try {
            value = ctx.instance.computed[name].apply(ctx.instance);
        }
        catch (e) {
            /* istanbul ignore next */
            handleError(e, ctx.instance, 'computed:' + name);
        }
        return value;
    }
    function iterate(val) {
        return isArray(val) ? val.entries() : Object.entries(val);
    }
    function createFromPrototype(proto) {
        function Creator() { }
        Creator.prototype = proto;
        return new Creator();
    }
    function createInstanceFromClass(Clazz) {
        // method
        // compiled inited initData
        const inited = Clazz.prototype.inited;
        delete Clazz.prototype.inited;
        const initData = Clazz.prototype.initData;
        delete Clazz.prototype.initData;
        // property
        // template filters components computed trimWhitespace delimiters
        const template = Clazz.template || Clazz.prototype.template;
        const components = Clazz.components || Clazz.prototype.components;
        delete Clazz.components;
        delete Clazz.prototype.components;
        const computed = Clazz.computed || Clazz.prototype.computed;
        delete Clazz.computed;
        delete Clazz.prototype.computed;
        Clazz.prototype.template = '<div></div>';
        const instance = new Clazz();
        if (inited)
            Clazz.prototype.inited = inited;
        if (initData)
            Clazz.prototype.initData = initData;
        if (components)
            Clazz.prototype.components = components;
        Clazz.prototype.template = template;
        if (computed)
            instance['computed'] = Clazz.prototype.computed = Clazz.computed = computed;
        return instance;
    }
    function getRootCtx(ctx) {
        let last = ctx;
        while (ctx.parentCtx) {
            last = ctx;
            ctx = ctx.parentCtx;
        }
        // 如果跟组件 render 调用的时候传递了 parentCtx，会找到这个对象
        // 通过 ctx 是否有 data 来判断是不是真正的 rootCtx
        // @ts-ignore
        return ctx.data ? ctx : last;
    }
    function handleError(e, instance, info) {
        let current = instance;
        while (current) {
            if (typeof current.error === 'function') {
                current.error(e, instance, info);
                return;
            }
            current = current.parentComponent;
        }
        throw e;
    }
    function mergeChildSlots(childSlots) {
        const sourceSlots = {
            named: {},
            noname: false
        };
        const keys = Object.keys(childSlots);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key === '') {
                sourceSlots.noname = true;
                continue;
            }
            sourceSlots.named[key] = true;
        }
        return sourceSlots;
    }
    exports._ = {
        output,
        createInstanceFromClass,
        escapeHTML,
        boolAttrFilter,
        attrFilter,
        classFilter,
        styleFilter,
        xstyleFilter,
        xclassFilter,
        createFromPrototype,
        getRootCtx,
        iterate,
        callFilter,
        callComputed,
        handleError,
        mergeChildSlots
    };
    //# sourceMappingURL=underscore.js.map
    
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SanSSRData = void 0;
    /**
     * 字符串源码读取类，用于模板字符串解析过程
     *
     * @param {string} source 要读取的字符串
     */
    class Walker {
        constructor(source) {
            this.source = source;
            this.len = this.source.length;
            this.index = 0;
        }
        /**
         * 向前读取符合规则的字符片段，并返回规则匹配结果
         *
         * @param reg 字符片段的正则表达式
         * @param isMatchStart 是否必须匹配当前位置
         * @return
         */
        match(reg, isMatchStart) {
            reg.lastIndex = this.index;
            const match = reg.exec(this.source);
            if (match && (!isMatchStart || this.index === match.index)) {
                this.index = reg.lastIndex;
                return match;
            }
        }
        ;
    }
    /**
     * 读取ident
     * 这里的 ident 指标识符(identifier)，也就是通常意义上的变量名
     * 这里默认的变量名规则为：由美元符号($)、数字、字母或者下划线(_)构成的字符串
     *
     * @inner
     * @param walker 源码读取对象
     * @return {string}
     */
    function readIdent(walker) {
        const match = walker.match(/\s*([$0-9a-z_]+)/ig, true);
        if (!match) {
            throw new Error('[SAN_SSR FATAL] expect an identifier: ' + walker.source.slice(walker.index));
        }
        return match[1];
    }
    /**
     * 读取字符串
     *
     * @param walker 源码读取对象
     */
    function readString(walker) {
        const startChar = walker.source.charAt(walker.index);
        const index = walker.source.indexOf(startChar, walker.index + 1);
        if (index === -1) {
            throw new Error('[SAN_SSR FATAL] expect a string: ' + walker.source.slice(walker.index));
        }
        const value = walker.source.slice(walker.index + 1, index);
        walker.index = index + 1;
        return value;
    }
    /**
     * 读取访问表达式
     *
     * @param walker 源码读取对象
     * @return {Object}
     */
    function readAccessor(walker) {
        const firstSeg = readIdent(walker);
        const result = [
            firstSeg
        ];
        while (walker.index < walker.len) {
            switch (walker.source.charCodeAt(walker.index)) {
                case 46: // .
                    walker.index++;
                    // ident as string
                    result.push(readIdent(walker));
                    break;
                case 91: { // [
                    walker.index++;
                    let currentCode = walker.source.charCodeAt(walker.index);
                    if (currentCode >= 48 && currentCode <= 57) { // 0-9
                        result.push(+(walker.match(/[0-9]+(\.[0-9]+)?/g, true)[0]));
                    }
                    else if (currentCode === 34 || currentCode === 39) {
                        result.push(readString(walker));
                    }
                    else {
                        throw new Error('[SAN_SSR FATAL] identifier is not support: ' + walker.source.slice(walker.index));
                    }
                    currentCode = walker.source.charCodeAt(walker.index);
                    if (currentCode !== 93) {
                        throw new Error('[SAN_SSR FATAL] expect ]: ' + walker.source.slice(walker.index));
                    }
                    walker.index++;
                    break;
                }
                default:
                    throw new Error('[SAN_SSR FATAL] expect . or [: ' + walker.source.slice(walker.index));
            }
        }
        return result;
    }
    /**
     * SSR 期间的 Data 实现，替代 import('san').SanSSRData
     *
     * * 不涉及视图更新
     * * 便于编译期优化
     */
    class SanSSRData {
        constructor(data, instance) {
            this.data = data;
            this.computed = instance.computed || {};
        }
        get(path) {
            if (arguments.length === 0)
                return this.data;
            if (this.computed[path])
                return this.computed[path].call({ data: this });
            let res = this.data;
            const paths = this.parseExpr(path);
            for (let i = 0; i < paths.length; i++) {
                const p = paths[i];
                if (res == null) {
                    break;
                }
                res = res[p];
            }
            return res;
        }
        set(path, value) {
            const seq = this.parseExpr(path);
            let parent = this.data;
            for (let i = 0; i < seq.length - 1; i++) {
                const name = seq[i];
                if (parent[name]) {
                    parent = parent[name];
                }
                else {
                    return null;
                }
            }
            parent[seq.pop()] = value;
            return value;
        }
        removeAt(path, index) {
            const value = this.get(path);
            if (value && value.splice)
                value.splice(index, 1);
        }
        parseExpr(expr) {
            return readAccessor(new Walker(expr));
        }
    }
    exports.SanSSRData = SanSSRData;
    //# sourceMappingURL=san-ssr-data.js.map
    
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createResolver = void 0;
    function createResolver(exports, require) {
        const renderCache = {};
        return {
            getRenderer: function ({ id, specifier = '.' }, tagName, context) {
                const customSSRFilePath = context && context.customSSRFilePath;
                const cacheKey = id + '  ' + specifier;
                // 没有自定义时，尝试缓存
                if (!customSSRFilePath && renderCache[cacheKey]) {
                    return renderCache[cacheKey];
                }
                let mod;
                if (specifier === '.') {
                    mod = exports;
                }
                else {
                    let path;
                    if (customSSRFilePath) {
                        path = customSSRFilePath({ id, specifier, tagName });
                    }
                    mod = require(path || specifier);
                }
                if (!customSSRFilePath) {
                    renderCache[cacheKey] = mod.sanSSRRenders[id];
                }
                return mod.sanSSRRenders[id];
            },
            getChildComponentClass: function ({ id, specifier = '.' }, instance, tagName, context) {
                var _a, _b;
                const customComponentFilePath = context && context.customComponentFilePath;
                const pro = Object.getPrototypeOf(instance);
                if (!pro.__componentClassCache) {
                    pro.__componentClassCache = {};
                }
                const componentClassCache = pro.__componentClassCache;
                const cacheKey = tagName;
                // 没有自定义时，尝试缓存
                if (!customComponentFilePath && componentClassCache[cacheKey]) {
                    return componentClassCache[cacheKey];
                }
                if (customComponentFilePath && specifier !== '.') {
                    const path = customComponentFilePath({ id, specifier, tagName });
                    if (typeof path === 'string')
                        return id === 'default' ? require(path) : require(path)[id];
                    // 可以直接返回一个组件类
                    else if (typeof path === 'function')
                        return path;
                }
                const components = instance.components || (instance.prototype && instance.prototype.components);
                const ChildComponentClassOrInstance = components && components[tagName];
                if (!ChildComponentClassOrInstance) {
                    throw Error(`child component is not fount: ${tagName}${((_a = instance.prototype) === null || _a === void 0 ? void 0 : _a.id) || ''}`);
                }
                if (typeof ChildComponentClassOrInstance === 'string' && ChildComponentClassOrInstance === 'self') {
                    componentClassCache[cacheKey] = instance;
                    return instance;
                }
                // component loader
                if (Object.prototype.hasOwnProperty.call(ChildComponentClassOrInstance, 'load') &&
                    Object.prototype.hasOwnProperty.call(ChildComponentClassOrInstance, 'placeholder')) {
                    componentClassCache[cacheKey] = ChildComponentClassOrInstance.placeholder;
                    return ChildComponentClassOrInstance.placeholder;
                }
                if (typeof ChildComponentClassOrInstance !== 'function' &&
                    typeof ChildComponentClassOrInstance !== 'object') {
                    throw Error(`external component is not provided: ${tagName}${((_b = instance.prototype) === null || _b === void 0 ? void 0 : _b.id) || ''}`);
                }
                componentClassCache[cacheKey] = ChildComponentClassOrInstance;
                return ChildComponentClassOrInstance;
            },
            setRenderer: function (id, fn) {
                exports.sanSSRRenders = exports.sanSSRRenders || {};
                exports.sanSSRRenders[id] = fn;
            },
            getPrototype: function (id) {
                return this['prototypes'][id];
            },
            setPrototype: function (id, proto) {
                this['prototypes'][id] = proto;
            },
            prototypes: {}
        };
    }
    exports.createResolver = createResolver;
    //# sourceMappingURL=resolver.js.map
    
    return exports;
})({});
const sanSSRResolver = sanSSRHelpers.createResolver(exports, require);
const _ = sanSSRHelpers._;
sanSSRResolver.setRenderer("0", (function  () {
    let ctx
    function setGlobalCtx (c) {
        ctx = c;
};
    let childSlots8Static = {}
    childSlots8Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData8 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                                            " + _.output(ctx.data.text, true) + _.output(ctx.data.item, true) + "\n                                        ";
        html += "<!--/s-slot-->";
        ctx.data = compData8;
        return html;
};
    let childSlots7Static = {}
    childSlots7Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData7 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                                        " + _.output(ctx.data.text, true) + "\n                                        ";
        let childSlots8 = {}
        childSlots8[""] = childSlots8Static[""];
        let ChildComponentClass = sanSSRResolver.getChildComponentClass({specifier: ".", id: "9"}, ctx.instance, "x-h", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "9"}, "x-h", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-h", slots: childSlots8, ComponentClass: ChildComponentClass});
        html += "\n                                    <!--/s-slot-->";
        ctx.data = compData7;
        return html;
};
    let childSlots6Static = {}
    childSlots6Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData6 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                                    " + _.output(ctx.data.text, true) + "\n                                    ";
        let childSlots7 = {}
        childSlots7[""] = childSlots7Static[""];
        let ChildComponentClass1 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "8"}, ctx.instance, "x-g", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "8"}, "x-g", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-g", slots: childSlots7, ComponentClass: ChildComponentClass1});
        html += "\n                                <!--/s-slot-->";
        ctx.data = compData6;
        return html;
};
    let childSlots5Static = {}
    childSlots5Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData5 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                                " + _.output(ctx.data.text, true) + "\n                                ";
        let childSlots6 = {}
        childSlots6[""] = childSlots6Static[""];
        let ChildComponentClass2 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "7"}, ctx.instance, "x-f", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "7"}, "x-f", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-f", slots: childSlots6, ComponentClass: ChildComponentClass2});
        html += "\n                            <!--/s-slot-->";
        ctx.data = compData5;
        return html;
};
    let childSlots4Static = {}
    childSlots4Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData4 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                            " + _.output(ctx.data.text, true) + "\n                            ";
        let childSlots5 = {}
        childSlots5[""] = childSlots5Static[""];
        let ChildComponentClass3 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "6"}, ctx.instance, "x-e", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "6"}, "x-e", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-e", slots: childSlots5, ComponentClass: ChildComponentClass3});
        html += "\n                        <!--/s-slot-->";
        ctx.data = compData4;
        return html;
};
    let childSlots3Static = {}
    childSlots3Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData3 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                        " + _.output(ctx.data.text, true) + "\n                        ";
        let childSlots4 = {}
        childSlots4[""] = childSlots4Static[""];
        let ChildComponentClass4 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "5"}, ctx.instance, "x-d", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "5"}, "x-d", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-d", slots: childSlots4, ComponentClass: ChildComponentClass4});
        html += "\n                    <!--/s-slot-->";
        ctx.data = compData3;
        return html;
};
    let childSlots2Static = {}
    childSlots2Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData2 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                    " + _.output(ctx.data.text, true) + "\n                    ";
        let childSlots3 = {}
        childSlots3[""] = childSlots3Static[""];
        let ChildComponentClass5 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "4"}, ctx.instance, "x-c", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "4"}, "x-c", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-c", slots: childSlots3, ComponentClass: ChildComponentClass5});
        html += "\n                <!--/s-slot-->";
        ctx.data = compData2;
        return html;
};
    let childSlots1Static = {}
    childSlots1Static[""] = function  (parentCtx, data) {
        let html = ""
        html += "<!--s-slot-->";
        let compData1 = ctx.data
        Object.assign(ctx.data, data);
        html += "\n                " + _.output(ctx.data.text, true) + "\n                ";
        let childSlots2 = {}
        childSlots2[""] = childSlots2Static[""];
        let ChildComponentClass6 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "3"}, ctx.instance, "x-b", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "3"}, "x-b", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-b", slots: childSlots2, ComponentClass: ChildComponentClass6});
        html += "\n            <!--/s-slot-->";
        ctx.data = compData1;
        return html;
};
    let childSlotsStatic = {}
    childSlotsStatic[""] = function  (parentCtx, data) {
        let html = ""
        let compData = ctx.data
        Object.assign(ctx.data, data);
        html += "\n            ";
        let childSlots1 = {}
        childSlots1[""] = childSlots1Static[""];
        let ChildComponentClass7 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "2"}, ctx.instance, "x-a", ctx.context)
        html += sanSSRResolver.getRenderer({specifier: ".", id: "2"}, "x-a", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-a", slots: childSlots1, ComponentClass: ChildComponentClass7});
        html += "\n        ";
        ctx.data = compData;
        return html;
};
    return function  (data, ...info) {
        if (info.length === 1) {
            info = info[0] || {};
        }
        else {
            info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
        }
        let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
        let parentCtx = info.parentCtx == null ? null : info.parentCtx
        let tagName = info.tagName == null ? "div" : info.tagName
        let slots = info.slots == null ? {} : info.slots
        const SanSSRData = sanSSRHelpers.SanSSRData;
        if (!sanSSRResolver.getPrototype("0")) {
            let ComponentClass = info.ComponentClass
            if (typeof ComponentClass === 'function') {
                sanSSRResolver.setPrototype("0", _.createInstanceFromClass(ComponentClass));
            }
            else {
                sanSSRResolver.setPrototype("0", ComponentClass);
            }
        };
        let instance = _.createFromPrototype(sanSSRResolver.getPrototype("0"));
        instance.data = new SanSSRData(data, instance);
        instance.sourceSlots = _.mergeChildSlots(slots);
        instance.lifeCycle = {compiled: true, inited: false};
        if (parentCtx) {
            instance.parentComponent = parentCtx.instance;
        }
        let refs = {}
        let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
        setGlobalCtx(ctx);
        let initData
        try {
            initData = instance.initData();
        }
        catch (e) {
            _.handleError(e, instance, "initData");
        }
        if (null == initData) {
            initData = {};
        }
        for (let [key, value] of _.iterate(initData)) {
            ctx.data[key] = ctx.data[key] !== undefined ? ctx.data[key] : value;
        }
        instance.lifeCycle.inited = true;
        let html = ""
        parentCtx = ctx;
        html += "<div";
        html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
        html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
        html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
        html += ">";
        if (!noDataOutput) {
            let data = _.getRootCtx(ctx).data
            if (info.outputData) {
                data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
            }
            html += "<!--s-data:";
            html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
            html += "-->";
        }
        html += "\n        ";
        let list = ctx.data.list
        for (let [key, val] of _.iterate(list)) {
            ctx.data.item = val;
            let childSlots = {}
            childSlots[""] = childSlotsStatic[""];
            let ChildComponentClass8 = sanSSRResolver.getChildComponentClass({specifier: ".", id: "1"}, ctx.instance, "x-p", ctx.context)
            html += sanSSRResolver.getRenderer({specifier: ".", id: "1"}, "x-p", ctx.context)({}, {noDataOutput: true, parentCtx, tagName: "x-p", slots: childSlots, ComponentClass: ChildComponentClass8});
        }
        html += "\n    </div>";
        return html;
};
})());
sanSSRResolver.setRenderer("9", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("9")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("9", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("9", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("9"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("8", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("8")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("8", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("8", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("8"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("7", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("7")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("7", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("7", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("7"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("6", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("6")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("6", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("6", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("6"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("5", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("5")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("5", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("5", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("5"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("4", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("4")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("4", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("4", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("4"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("3", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("3")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("3", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("3", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("3"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("2", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("2")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("2", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("2", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("2"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<a";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</a>";
    return html;
});
sanSSRResolver.setRenderer("1", function  (data, ...info) {
    if (info.length === 1) {
        info = info[0] || {};
    }
    else {
        info = {noDataOutput: info[1], parentCtx: info[2], tagName: info[3], slots: info[4]};
    }
    let noDataOutput = info.noDataOutput == null ? false : info.noDataOutput
    let parentCtx = info.parentCtx == null ? null : info.parentCtx
    let tagName = info.tagName == null ? "div" : info.tagName
    let slots = info.slots == null ? {} : info.slots
    const SanSSRData = sanSSRHelpers.SanSSRData;
    if (!sanSSRResolver.getPrototype("1")) {
        let ComponentClass = info.ComponentClass
        if (typeof ComponentClass === 'function') {
            sanSSRResolver.setPrototype("1", _.createInstanceFromClass(ComponentClass));
        }
        else {
            sanSSRResolver.setPrototype("1", ComponentClass);
        }
    };
    let instance = _.createFromPrototype(sanSSRResolver.getPrototype("1"));
    instance.data = new SanSSRData(data, instance);
    instance.sourceSlots = _.mergeChildSlots(slots);
    instance.lifeCycle = {compiled: true, inited: false};
    if (parentCtx) {
        instance.parentComponent = parentCtx.instance;
    }
    let refs = {}
    let ctx = {instance, slots, data, parentCtx, refs, context: parentCtx && parentCtx.context}
    instance.lifeCycle.inited = true;
    let html = ""
    parentCtx = ctx;
    html += "<p";
    html += _.attrFilter("class", _.escapeHTML(_.classFilter(_.xclassFilter(ctx.data.class))), false);
    html += _.attrFilter("style", _.escapeHTML(_.styleFilter(_.xstyleFilter(ctx.data.style))), false);
    html += _.attrFilter("id", _.escapeHTML(ctx.data.id), false);
    html += ">";
    if (!noDataOutput) {
        let data = _.getRootCtx(ctx).data
        if (info.outputData) {
            data = typeof (info.outputData) === "function" ? info.outputData(_.getRootCtx(ctx).data) : info.outputData;
        }
        html += "<!--s-data:";
        html += JSON.stringify(data).replace(/(?<=-)-/g, "\\-");
        html += "-->";
    }
    let defaultRender = function  (parentCtx, data) {
        return "";
}
    let slotData = {}
    let slotName = ""
    let render = ctx.slots[slotName] || defaultRender
    html += render(parentCtx, slotData);
    html += "</p>";
    return html;
});
module.exports = Object.assign(sanSSRResolver.getRenderer({id:"0"}), exports)
