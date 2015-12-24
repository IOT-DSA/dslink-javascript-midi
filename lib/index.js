import { LinkProvider } from 'dslink';
import { EventEmitter } from 'events';

import { GetRawAction } from './nodes/input/get_raw';

import { CreatePortAction } from './nodes/create_port';
import { ClosePortAction } from './nodes/port/close_port';
import { CreatePipeAction } from './nodes/port/create_pipe';
import { PipeEnableAction, PipeDisableAction, PipeCloseAction } from './nodes/port/pipe';

import { generateProfiles } from './util';
import { defaultNodes, generateInput } from './structure';

import midi from 'midi';

let lastInputCount = 0;
let inputs = [];

// ONLY USE IF NODE IS CREATED AFTER INITIALIZATION!!!
let requester;

const link = new LinkProvider(process.argv.slice(2), 'midi-', {
  defaultNodes,
  profiles: Object.assign(
      generateProfiles(
          GetRawAction,
          CreatePortAction,
          ClosePortAction,
          PipeEnableAction,
          PipeDisableAction,
          PipeCloseAction
      ),
      {
        [CreatePipeAction.profileName]: (path, provider) => CreatePipeAction.factory(path, provider, requester)
      }
  ),
  isResponder: true,
  isRequester: true
});

link.connect().then(() => link.onRequesterReady).then((req) => {
  requester = req;
  const input = new midi.input();

  setInterval(() => {
    const count = input.getPortCount();
    const diff = Math.abs(lastInputCount - count);

    if(count > lastInputCount) {
      // add new inputs
      for(var i = 0; i < diff; i++) {
        const newInput = new midi.input();

        newInput.openPort(lastInputCount + i);
        newInput.ignoreTypes(false, false, false);

        const inputObj = {
          input: newInput,
          index: lastInputCount + i,
          name: input.getPortName(lastInputCount + i),
          emitter: new EventEmitter()
        };

        inputs[lastInputCount + i] = inputObj;

        console.log(`Added MIDI device ${input.getPortName(inputObj.index)}.`);

        link.addNode(`/inputs/${inputObj.index}`, generateInput(inputObj));
      }
    } else if(count < lastInputCount) {
      // remove inputs
      for(var i = 1; i <= diff; i++) {
        var inputObj = inputs[lastInputCount - i];

        inputObj.input.closePort();
        inputObj.emitter.emit('close');

        inputs = inputs.splice(0, lastInputCount - 1);

        console.log(`Removed MIDI device ${inputObj.name}.`);
        link.removeNode(`/inputs/${inputObj.index}`);
      }
    }

    lastInputCount = count;
  }, 1000);
});
