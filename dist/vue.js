(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  var starts = {};
  var LIFE_CYCLE_LIST = ["beforeCreat", "created"];
  LIFE_CYCLE_LIST.forEach(function (hook) {
    starts[hook] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        } else {
          return [c];
        }
      } else {
        return p;
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};
    for (var key in parent) {
      mergeKey(key);
    }
    for (var _key in child) {
      if (!options.hasOwnProperty(_key)) {
        mergeKey(_key);
      }
    }
    function mergeKey(key) {
      if (starts[key]) {
        options[key] = starts[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }
    return options;
  }

  function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;
  function parseHTML(html) {
    var stack = [];
    var currentTag = undefined;
    var root = undefined;
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    function start(tagName, attrs) {
      var ast = createASTElement(tagName, attrs);
      if (!root) {
        root = ast;
      } else if (currentTag) {
        currentTag.children.push(ast);
        ast.parent = currentTag;
      }
      currentTag = ast;
      stack.push(ast);
    }
    function chars(text) {
      text = text.replace(/\s/g, '');
      text && currentTag.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentTag
      });
    }
    function end(tagName) {
      stack.pop();
      currentTag = stack[stack.length - 1];
    }
    var _loop = function _loop() {
      var textEnd = html.indexOf('<');
      function advance(n) {
        html = html.substring(n);
      }
      function parseStartTag() {
        var start = html.match(startTagOpen);
        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length);
          var attr;
          var _end;
          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            advance(attr[0].length);
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
          }
          if (_end) {
            advance(_end[0].length);
          }
          return match;
        }
        return false;
      }
      if (textEnd === 0) {
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          return "continue";
        }
        var endTagName = html.match(endTag);
        if (endTagName) {
          end(endTagName[1]);
          advance(endTagName[0].length);
          return "continue";
        }
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    };
    while (html) {
      var _ret = _loop();
      if (_ret === "continue") continue;
    }
    return root;
  }

  function genProps(attrs) {
    var str = '';
    attrs.forEach(function (attr) {
      if (attr.name === 'style') {
        var valArray = attr.value.split(';');
        attr.value = {};
        valArray.forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          attr.value[key] = value;
        });
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    });
    return "{".concat(str.slice(0, -1), "}");
  }
  function gen(node) {
    if (node.type === ELEMENT_TYPE) {
      return codegen(node);
    } else if (node.type === TEXT_TYPE) {
      if (!defaultTagRE.test(node.text)) {
        return "_v(".concat(JSON.stringify(node.text), ")");
      } else {
        var tokens = [];
        var match;
        var lastIndex = 0;
        defaultTagRE.lastIndex = 0;
        while (match = defaultTagRE.exec(node.text)) {
          if (match.index > lastIndex) {
            var middleText = node.text.slice(lastIndex, match.index);
            tokens.push(JSON.stringify(middleText));
          }
          tokens.push("_s(".concat(match[1], ")"));
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < node.text.length - 1) {
          tokens.push(JSON.stringify(node.text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }
  function genChildren(children) {
    if (children) {
      return children.map(function (item) {
        return gen(item);
      }).join(',');
    }
  }
  function codegen(ast) {
    var code = "_c('".concat(ast.tag, "', ").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null', " ").concat(ast.children.length ? ",".concat(genChildren(ast.children)) : '', ")");
    return code;
  }
  function compileToFunction(template) {
    var ast = parseHTML(template);
    var code = codegen(ast);
    code = "with(this) {\n    return ".concat(code, "\n  }");
    var render = new Function(code);
    return render;
  }

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = []; // save watcher
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (item) {
          return item.update();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, options, cb) {
      _classCallCheck(this, Watcher);
      this.id = id++;
      this.lazy = options.lazy;
      this.dirty = this.lazy;
      // this.isRenderWatcher = isRenderWatcher

      if (typeof expOrFn === 'string') {
        this.getter = function () {
          return vm[expOrFn];
        };
      } else {
        this.getter = expOrFn;
      }
      this.vm = vm;
      this.deps = [];
      this.depSet = new Set();
      this.cb = cb;
      this.value = this.lazy ? null : this.get();
      this.user = options.user;
    }
    _createClass(Watcher, [{
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend();
        }
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        if (this.depSet.has(dep.id)) {
          return;
        }
        this.deps.push(dep);
        this.depSet.add(dep.id);
        dep.addSub(this);
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm);
        popTarget();
        return value;
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newValue = this.get();
        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }]);
    return Watcher;
  }();
  var watcherQueue = [];
  var has = {};
  var pending = false;
  function flushWatcherQueue() {
    var copyedQueue = _toConsumableArray(watcherQueue);
    watcherQueue = [];
    has = {};
    pending = false;
    copyedQueue.forEach(function (item) {
      item.run();
    });
  }
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id]) {
      return;
    }
    watcherQueue.push(watcher);
    has[id] = watcher;
    if (!pending) {
      pending = true;
      nextTick(flushWatcherQueue);
    }
  }
  var callbackList = [];
  var waiting = false;
  function flushCallbackList() {
    var copyedCallbackList = _toConsumableArray(callbackList);
    callbackList = [];
    waiting = false;
    copyedCallbackList.forEach(function (item) {
      return item();
    });
  }
  function nextTick(callback) {
    callbackList.push(callback);
    if (!waiting) {
      timerFunc();
      waiting = true;
    }
  }
  var timerFunc;
  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbackList);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCallbackList);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setTimeout) {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbackList);
    };
  }

  function createElementVNode(vm, tag, data) {
    data = data || {};
    var key = data.key;
    key && delete data.key;
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }
  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  function patchProps(el, oldProps, props) {
    var oldStyle = oldProps.style || {};
    var style = props.style || {};
    for (var key in oldStyle) {
      if (!style[key]) {
        el.style[key] = '';
      }
    }
    for (var _key in oldProps) {
      if (!props[_key]) {
        el.removeAttribute(_key);
      }
    }
    for (var _key2 in props) {
      if (_key2 === 'style') {
        for (var styleName in props[_key2]) {
          el.style[styleName] = props[_key2][styleName];
        }
      } else {
        el.setAttribute(_key2, props[_key2]);
      }
    }
  }
  function createElm(vnode) {
    var tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, {}, data);
      children.forEach(function (item) {
        vnode.el.appendChild(createElm(item));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function patch(oldVnode, vnode) {
    var isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      var elm = oldVnode;
      var parentElm = elm.parentNode;
      var newElm = createElm(vnode);
      parentElm.insertBefore(newElm, elm.nextSibling);
      parentElm.removeChild(elm);
      return newElm;
    } else {
      patchVnode(oldVnode, vnode);
    }
  }
  function patchVnode(oldVnode, vnode) {
    if (!isSameVnode(oldVnode, vnode)) {
      var _el = createElm(vnode);
      oldVnode.el.parentNode.replaceChild(_el, oldVnode.el);
      return _el;
    }
    var el = vnode.el = oldVnode.el;
    if (!vnode.tag) {
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
    }
    patchProps(el, vnode.data, oldVnode.data);
    var oldChildren = oldVnode.children || [];
    var newChildren = vnode.children;
    if (oldChildren.length > 0 && newChildren.length > 0) ; else if (newChildren.length > 0) {
      mountChildren(el, newChildren);
    } else if (oldChildren.length > 0) {
      el.innerHTML = '';
    }
  }
  function mountChildren(el, children) {
    for (var i = 0; i < children.length; i++) {
      var node = createElm(children[i]);
      el.appendChild(node);
    }
  }

  function initLifyCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      vm.$el = patch(el, vnode);
    };
    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      return typeof value === 'string' ? value : JSON.stringify(value);
    };
    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    var updateComponent = function updateComponent() {
      return vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, true);
  }
  function callhook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      handlers.forEach(function (item) {
        return item.call(vm);
      });
    }
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (item) {
    newArrayProto[item] = function () {
      var _oldArrayProto$item;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$item = oldArrayProto[item]).call.apply(_oldArrayProto$item, [this].concat(args));
      var instered = undefined;
      var ob = this.__ob__;
      if (item === 'push' || item === 'unshift') {
        instered = args;
      }
      if (item === 'splice') {
        instered = args.slice(2);
      }
      if (instered) {
        ob.observeArray(instered);
      }
      ob.dep.notify();
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto;
        this.observeArray(data);
        return;
      }
      this.walk(data);
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observer;
  }();
  function depentArray(val) {
    for (var i = 0; i < val.length; i++) {
      var current = val[i];
      current.__ob__ && current.__ob__.dep.depend();
      if (Array.isArray(current)) {
        depentArray(current);
      }
    }
  }
  function defineReactive(data, key, val) {
    var childOb = observe(val);

    // every reactive data has a dep
    var dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        if (Dep.target) {
          dep.depend();
          childOb && childOb.dep.depend();
          if (Array.isArray(val)) {
            depentArray(val);
          }
        }
        return val;
      },
      set: function set(newVal) {
        if (newVal === val) {
          return;
        }
        observe(newVal);
        val = newVal;
        dep.notify();
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' && data !== null) {
      return;
    }
    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    }
    return new Observer(data);
  }

  function initState(vm) {
    var options = vm.$options;
    if (options.data) {
      initData(vm);
    }
    if (options.computed) {
      initComputed(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        return vm[target][key];
      },
      set: function set(newVal) {
        vm[target][key] = newVal;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    observe(data);
    vm._data = data;
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }
  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._watcherList = {};
    for (var key in computed) {
      var userDef = computed[key];
      var fn = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, fn, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }
  function createComputedGetter(key) {
    return function () {
      var watcher = this._watcherList[key];
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    };
  }
  function defineComputed(target, key, userDef) {
    var setter = userDef.set || function () {};
    Object.defineProperty(target, key, {
      get: createComputedGetter(key),
      set: setter
    });
  }
  function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype.$watch = function (expOrFn, cb, options) {
      new Watcher(this, expOrFn, {
        user: true
      }, cb);
    };
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(this.constructor.options, options);
      callhook(vm, 'beforeCreate');
      initState(vm);
      callhook(vm, 'created');
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;
      var template;

      // 暂时不支持 ops.template 提供模板
      if (el) {
        template = el.outerHTML;
      }
      if (template) {
        var render = compileToFunction(template);
        ops.render = render;
      }
      mountComponent(vm, el);
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);
  initLifyCycle(Vue);
  initGlobalApi(Vue);
  initStateMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
