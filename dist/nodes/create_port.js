'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatePortAction = exports.portIds = undefined;

var _dslink = require('dslink');

var _dslink2 = _interopRequireDefault(_dslink);

var _midi = require('midi');

var _midi2 = _interopRequireDefault(_midi);

var _structure = require('../structure');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var portIds = exports.portIds = ['createPort'];

var CreatePortAction = exports.CreatePortAction = (function (_SimpleNode$class) {
  _inherits(CreatePortAction, _SimpleNode$class);

  function CreatePortAction() {
    _classCallCheck(this, CreatePortAction);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CreatePortAction).apply(this, arguments));
  }

  _createClass(CreatePortAction, [{
    key: 'onInvoke',
    value: function onInvoke(params) {
      if (portIds.indexOf(params.id) > -1) return [[false, 'name already exists']];
      portIds.push(params.id);

      var output = new _midi2.default.output();
      output.openVirtualPort(params.name);

      this.provider.addNode('/ports/' + params.id, (0, _structure.generatePort)(output, params.name, params.id));

      return [[true, '\'' + params.name + '\' added']];
    }
  }], [{
    key: 'factory',
    value: function factory(path, provider) {
      return new CreatePortAction(path, provider);
    }
  }]);

  return CreatePortAction;
})(_dslink.SimpleNode.class);

CreatePortAction.profileName = 'createPort';