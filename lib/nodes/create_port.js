import DS, { SimpleNode, AsyncTableResult, StreamStatus } from 'dslink';
import midi from 'midi';

import { generatePort } from '../structure';

export let portIds = ['createPort'];

export class CreatePortAction extends SimpleNode.class {
  static factory(path, provider) {
    return new CreatePortAction(path, provider);
  }

  onInvoke(params) {
    if(portIds.indexOf(params.id) > -1)
      return [[false, 'name already exists']];
    portIds.push(params.id);

    var output = new midi.output();
    output.openVirtualPort(params.name);

    this.provider.addNode(`/ports/${params.id}`, generatePort(output, params.name, params.id));

    return [[true, `'${params.name}' added`]];
  }
}

CreatePortAction.profileName = 'createPort';
