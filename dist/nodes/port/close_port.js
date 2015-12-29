'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClosePortAction = undefined;

var _dslink = require('dslink');

var _dslink2 = _interopRequireDefault(_dslink);

var _create_port = require('../create_port');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClosePortAction = exports.ClosePortAction = (function (_SimpleNode$class) {
  _inherits(ClosePortAction, _SimpleNode$class);

  function ClosePortAction() {
    _classCallCheck(this, ClosePortAction);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ClosePortAction).apply(this, arguments));
  }

  _createClass(ClosePortAction, [{
    key: 'load',
    value: function load(input) {
      if (input && input['?output']) {
        this.outputObj = input['?output'];
      }

      _get(Object.getPrototypeOf(ClosePortAction.prototype), 'load', this).call(this, input);
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(params) {
      _create_port.portIds.splice(_create_port.portIds.indexOf(this.configs.$$id), 1);
      this.provider.removeNode('/ports/' + this.configs.$$id);

      try {
        this.outputObj.closePort();
      } catch (e) {
        console.log(e);
      }
    }
  }], [{
    key: 'factory',
    value: function factory(path, provider) {
      return new ClosePortAction(path, provider);
    }
  }]);

  return ClosePortAction;
})(_dslink.SimpleNode.class);

ClosePortAction.profileName = 'closePort';