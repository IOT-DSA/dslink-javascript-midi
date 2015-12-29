'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatePipeAction = undefined;

var _dslink = require('dslink');

var _dslink2 = _interopRequireDefault(_dslink);

var _events = require('events');

var _util = require('../../util');

var _structure = require('../../structure');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreatePipeAction = exports.CreatePipeAction = (function (_SimpleNode$class) {
  _inherits(CreatePipeAction, _SimpleNode$class);

  function CreatePipeAction() {
    _classCallCheck(this, CreatePipeAction);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CreatePipeAction).apply(this, arguments));
  }

  _createClass(CreatePipeAction, [{
    key: 'load',
    value: function load(input) {
      if (input && input['?output']) {
        this.outputObj = input['?output'];
      }

      _get(Object.getPrototypeOf(CreatePipeAction.prototype), 'load', this).call(this, input);
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(params) {
      var _this2 = this;

      var output = this.outputObj;
      var requester = this.requester;

      return new Promise(function (resolve, reject) {
        var hasUpdated = false;
        var enabled = true;
        var stream = requester.invoke(params.rawDataAction).on('data', function (update) {
          if (!enabled) return;

          if (!hasUpdated) {
            var _ret = (function () {
              hasUpdated = true;
              if (update.error) {
                reject([[false, update.error.toString()]]);
                return {
                  v: undefined
                };
              }

              var emitter = new _events.EventEmitter();

              var pipePath = new _dslink.Path(_this2.path).parentPath + '/pipes/' + (0, _util.urlEncode)(params.rawDataAction);
              var enabledNode = undefined;

              emitter.on('enable', function () {
                enabled = true;
                if (!enabledNode) enabledNode = _this2.provider.getNode(pipePath + '/enabled');

                enabledNode.updateValue(true);
              });

              emitter.on('disable', function () {
                enabled = false;
                if (!enabledNode) enabledNode = _this2.provider.getNode(pipePath + '/enabled');

                enabledNode.updateValue(false);
              });

              emitter.on('close', function () {
                enabled = false;
                stream.close();

                _this2.provider.removeNode(pipePath);
                emitter.removeAllListeners();
              });

              _this2.provider.addNode(pipePath, (0, _structure.generatePipe)(params.rawDataAction, emitter));

              resolve([[true, '']]);
            })();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }

          if (update.error) return;

          update.updates.forEach(function (row) {
            if (Object.keys(row).length !== 3) return;
            output.sendMessage([row.status, row.data, row.data2]);
          });
        });
      });
    }
  }], [{
    key: 'factory',
    value: function factory(path, provider, requester) {
      var node = new CreatePipeAction(path, provider);
      // hacky, I guess
      node.requester = requester;
      return node;
    }
  }]);

  return CreatePipeAction;
})(_dslink.SimpleNode.class);

CreatePipeAction.profileName = "createPipe";