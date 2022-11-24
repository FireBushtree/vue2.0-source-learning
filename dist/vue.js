(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
      Object.defineProperty(target, descriptor.key, descriptor);
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
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
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
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    console.log(ast);
    var code = codegen(ast);
    code = "with(this) {\n    return ".concat(code, "\n  }");
    console.log(code);
    var render = new Function(code);
    return render;
  }

  function createElementVNode(vm, tag, data) {
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    console.log(children);
    data = data || {};
    var key = data.key;
    key && delete data.key;
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

  function initLifyCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log('update', vnode);
    };
    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      return JSON.stringify(value);
    };
    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    vm._update(vm._render());
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
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      data.__ob__ = this;
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
  function defineReactive(data, key, val) {
    observe(val);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return val;
      },
      set: function set(newVal) {
        if (newVal === val) {
          return;
        }
        observe(newVal);
        val = newVal;
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

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
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
      mountComponent(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);
  initLifyCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
