'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PipeCloseAction = exports.PipeDisableAction = exports.PipeEnableAction = undefined;

var _dslink = require('dslink');

var _dslink2 = _interopRequireDefault(_dslink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PipeEnableAction = exports.PipeEnableAction = (function (_SimpleNode$class) {
  _inherits(PipeEnableAction, _SimpleNode$class);

  function PipeEnableAction() {
    _classCallCheck(this, PipeEnableAction);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PipeEnableAction).apply(this, arguments));
  }

  _createClass(PipeEnableAction, [{
    key: 'load',
    value: function load(input) {
      if (input && input['?emitter']) {
        this.emitter = input['?emitter'];
      }

      _get(Object.getPrototypeOf(PipeEnableAction.prototype), 'load', this).call(this, input);
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(params) {
      this.emitter.emit('enable');
    }
  }], [{
    key: 'factory',
    value: function factory(path, provider) {
      return new PipeEnableAction(path, provider);
    }
  }]);

  return PipeEnableAction;
})(_dslink.SimpleNode.class);

var PipeDisableAction = exports.PipeDisableAction = (function (_SimpleNode$class2) {
  _inherits(PipeDisableAction, _SimpleNode$class2);

  function PipeDisableAction() {
    _classCallCheck(this, PipeDisableAction);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PipeDisableAction).apply(this, arguments));
  }

  _createClass(PipeDisableAction, [{
    key: 'load',
    value: function load(input) {
      if (input && input['?emitter']) {
        this.emitter = input['?emitter'];
      }

      _get(Object.getPrototypeOf(PipeDisableAction.prototype), 'load', this).call(this, input);
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(params) {
      this.emitter.emit('disable');
    }
  }], [{
    key: 'factory',
    value: function factory(path, provider) {
      return new PipeDisableAction(path, provider);
    }
  }]);

  return PipeDisableAction;
})(_dslink.SimpleNode.class);

var PipeCloseAction = exports.PipeCloseAction = (function (_SimpleNode$class3) {
  _inherits(PipeCloseAction, _SimpleNode$class3);

  function PipeCloseAction() {
    _classCallCheck(this, PipeCloseAction);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PipeCloseAction).apply(this, arguments));
  }

  _createClass(PipeCloseAction, [{
    key: 'load',
    value: function load(input) {
      if (input && input['?emitter']) {
        this.emitter = input['?emitter'];
      }

      _get(Object.getPrototypeOf(PipeCloseAction.prototype), 'load', this).call(this, input);
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(params) {
      this.emitter.emit('close');
    }
  }], [{
    key: 'factory',
    value: function factory(path, provider) {
      return new PipeCloseAction(path, provider);
    }
  }]);

  return PipeCloseAction;
})(_dslink.SimpleNode.class);

PipeEnableAction.profileName = 'pipeEnable';
PipeDisableAction.profileName = 'pipeDisable';
PipeCloseAction.profileName = 'pipeClose';