import DS, { SimpleNode } from 'dslink';

import { portIds } from '../create_port';

export class ClosePortAction extends SimpleNode.class {
  static factory(path, provider) {
    return new ClosePortAction(path, provider);
  }

  load(input) {
    if(input && input['?output']) {
      this.outputObj = input['?output'];
    }

    super.load(input);
  }

  onInvoke(params) {
    portIds.splice(portIds.indexOf(this.configs.$$id), 1);
    this.provider.removeNode(`/ports/${this.configs.$$id}`);

    try {
      this.outputObj.closePort();
    } catch(e) {
      console.log(e);
    }
  }
}

ClosePortAction.profileName = 'closePort';
