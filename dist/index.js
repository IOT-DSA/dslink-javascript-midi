'use strict';

require('babel-polyfill');

var _dslink = require('dslink');

var _events = require('events');

var _get_raw = require('./nodes/input/get_raw');

var _create_port = require('./nodes/create_port');

var _close_port = require('./nodes/port/close_port');

var _create_pipe = require('./nodes/port/create_pipe');

var _pipe = require('./nodes/port/pipe');

var _util = require('./util');

var _structure = require('./structure');

var _midi = require('midi');

var _midi2 = _interopRequireDefault(_midi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var lastInputCount = 0;
var inputs = [];

// ONLY USE IF NODE IS CREATED AFTER INITIALIZATION!!!
var requester = undefined;

var link = new _dslink.LinkProvider(process.argv.slice(2), 'midi-', {
  defaultNodes: _structure.defaultNodes,
  profiles: Object.assign((0, _util.generateProfiles)(_get_raw.GetRawAction, _create_port.CreatePortAction, _close_port.ClosePortAction, _pipe.PipeEnableAction, _pipe.PipeDisableAction, _pipe.PipeCloseAction), _defineProperty({}, _create_pipe.CreatePipeAction.profileName, function (path, provider) {
    return _create_pipe.CreatePipeAction.factory(path, provider, requester);
  })),
  isResponder: true,
  isRequester: true
});

link.connect().then(function () {
  return link.onRequesterReady;
}).then(function (req) {
  requester = req;
  var input = new _midi2.default.input();

  setInterval(function () {
    var count = input.getPortCount();
    var diff = Math.abs(lastInputCount - count);

    if (count > lastInputCount) {
      // add new inputs
      for (var i = 0; i < diff; i++) {
        var newInput = new _midi2.default.input();

        newInput.openPort(lastInputCount + i);
        newInput.ignoreTypes(false, false, false);

        var _inputObj = {
          input: newInput,
          index: lastInputCount + i,
          name: input.getPortName(lastInputCount + i),
          emitter: new _events.EventEmitter()
        };

        inputs[lastInputCount + i] = _inputObj;

        console.log('Added MIDI device ' + input.getPortName(_inputObj.index) + '.');

        link.addNode('/inputs/' + _inputObj.index, (0, _structure.generateInput)(_inputObj));
      }
    } else if (count < lastInputCount) {
      // remove inputs
      for (var i = 1; i <= diff; i++) {
        var inputObj = inputs[lastInputCount - i];

        inputObj.input.closePort();
        inputObj.emitter.emit('close');

        inputs = inputs.splice(0, lastInputCount - 1);

        console.log('Removed MIDI device ' + inputObj.name + '.');
        link.removeNode('/inputs/' + inputObj.index);
      }
    }

    lastInputCount = count;
  }, 1000);
});