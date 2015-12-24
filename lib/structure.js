import { GetRawAction } from './nodes/input/get_raw';

import { CreatePortAction } from './nodes/create_port';
import { ClosePortAction } from './nodes/port/close_port';
import { CreatePipeAction } from './nodes/port/create_pipe';
import { PipeEnableAction, PipeDisableAction, PipeCloseAction } from './nodes/port/pipe';

export const inputColumns = [
  {
    name: 'status',
    type: 'number'
  },
  {
    name: 'data',
    type: 'number'
  },
  {
    name: 'data2',
    type: 'number'
  }
];

export const defaultNodes = {
  inputs: {
    $is: 'node',
    $name: 'Inputs'
  },
  ports: {
    $is: 'node',
    $name: 'Virtual Ports',
    createPort: {
      $name: 'Create Virtual Port',
      $is: CreatePortAction.profileName,
      $invokable: 'write',
      $params: [
        {
          name: 'id',
          type: 'string'
        },
        {
          name: 'name',
          type: 'string'
        }
      ],
      $columns: [
        {
          name: 'successful',
          type: 'bool'
        },
        {
          name: 'message',
          type: 'string'
        }
      ]
    }
  }
};

export function generateInput(input) {
  return {
    $name: input.name,
    $is: 'node',
    getRaw: {
      $name: 'Get Raw MIDI Data',
      $is: GetRawAction.profileName,
      $invokable: 'write',
      $result: 'stream',
      $params: [],
      $columns: inputColumns,
      '?input': input
    }
  };
}

export function generatePort(output, name, id) {
  return {
    $name: name,
    $is: 'node',
    pipes: {
      $is: 'node'
    },
    closePort: {
      $name: 'Close Virtual Port',
      $is: ClosePortAction.profileName,
      $$id: id,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?output': output
    },
    createPipe: {
      $name: 'Pipe from MIDI Input',
      $is: CreatePipeAction.profileName,
      $invokable: 'write',
      $params: [
        {
          name: 'rawDataAction',
          type: 'string'
        }
      ],
      $columns: [
        {
          name: 'successful',
          type: 'bool'
        },
        {
          name: 'message',
          type: 'string'
        }
      ],
      '?output': output
    }
  };
}

export function generatePipe(name, emitter) {
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
      $is: PipeEnableAction.profileName,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?emitter': emitter
    },
    disablePipe: {
      $name: 'Disable Pipe',
      $is: PipeDisableAction.profileName,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?emitter': emitter
    },
    closePipe: {
      $name: 'Close Pipe',
      $is: PipeCloseAction.profileName,
      $invokable: 'write',
      $params: [],
      $columns: [],
      '?emitter': emitter
    }
  };
}
