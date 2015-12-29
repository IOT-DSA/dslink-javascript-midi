'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultNodes = exports.inputColumns = undefined;
exports.generateInput = generateInput;
exports.generatePort = generatePort;
exports.generatePipe = generatePipe;

var _get_raw = require('./nodes/input/get_raw');

var _create_port = require('./nodes/create_port');

var _close_port = require('./nodes/port/close_port');

var _create_pipe = require('./nodes/port/create_pipe');

var _pipe = require('./nodes/port/pipe');

var inputColumns = exports.inputColumns = [{
  name: 'status',
  type: 'number'
}, {
  name: 'data',
  type: 'number'
}, {
  name: 'data2',
  type: 'number'
}];

var defaultNodes = exports.defaultNodes = {
  inputs: {
    $is: 'node',
    $name: 'Inputs'
  },
  ports: {
    $is: 'node',
    $name: 'Virtual Ports',
    createPort: {
      $name: 'Create Virtual Port',
      $is: _create_port.CreatePortAction.profileName,
      $invokable: 'write',
      $params: [{
        name: 'id',
        type: 'string'
      }, {
        name: 'name',
        type: 'string'
      }],
      $columns: [{
        name: 'successful',
        type: 'bool'
      }, {
        name: 'message',
        type: 'string'
      }]
    }
  }
};

function generateInput(input) {
  return {
    $name: input.name,
    $is: 'node',
    getRaw: {
      $name: 'Get Raw MIDI Data',
      $is: _get_raw.GetRawAction.profileName,
      $invokable: 'write',
      $result: 'stream',
      $params: [],
      $columns: inputColumns,
      '?input': input
    }
  };
}

function generatePort(output, name, id) {
  return {
    $name: name,
    $is: 'node',
    pipes: {
      $is: 'node'
    },
    closePort: {
      $name: 'Close Virtual Port',
      $is: _close_port.ClosePortAction.profileName,
      $$id: id,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?output': output
    },
    createPipe: {
      $name: 'Pipe from MIDI Input',
      $is: _create_pipe.CreatePipeAction.profileName,
      $invokable: 'write',
      $params: [{
        name: 'rawDataAction',
        type: 'string'
      }],
      $columns: [{
        name: 'successful',
        type: 'bool'
      }, {
        name: 'message',
        type: 'string'
      }],
      '?output': output
    }
  };
}

function generatePipe(name, emitter) {
  return {
    $name: name,
    $is: 'node',
    enabled: {
      $name: 'Is Enabled',
      $type: 'bool',
      '?value': true
    },
    enablePipe: {
      $name: 'Enable Pipe',
      $is: _pipe.PipeEnableAction.profileName,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?emitter': emitter
    },
    disablePipe: {
      $name: 'Disable Pipe',
      $is: _pipe.PipeDisableAction.profileName,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?emitter': emitter
    },
    closePipe: {
      $name: 'Close Pipe',
      $is: _pipe.PipeCloseAction.profileName,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?emitter': emitter
    }
  };
}