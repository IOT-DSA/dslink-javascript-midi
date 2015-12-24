import DS, { SimpleNode, Path } from 'dslink';
import { EventEmitter } from 'events';

import { urlEncode } from '../../util';
import { generatePipe } from '../../structure';

export class CreatePipeAction extends SimpleNode.class {
  static factory(path, provider, requester) {
    const node = new CreatePipeAction(path, provider);
    // hacky, I guess
    node.requester = requester;
    return node;
  }

  load(input) {
    if(input && input['?output']) {
      this.outputObj = input['?output'];
    }

    super.load(input);
  }

  onInvoke(params) {
    const output = this.outputObj;
    const requester = this.requester;

    return new Promise((resolve, reject) => {
      let hasUpdated = false;
      let enabled = true;
      const stream = requester.invoke(params.rawDataAction).on('data', (update) => {
        if(!enabled)
          return;

        if(!hasUpdated) {
          hasUpdated = true;
          if(update.error) {
            reject([[false, update.error.toString()]]);
            return;
          }

          const emitter = new EventEmitter();

          let pipePath = `${new Path(this.path).parentPath}/pipes/${urlEncode(params.rawDataAction)}`;
          let enabledNode;

          emitter.on('enable', () => {
            enabled = true;
            if(!enabledNode)
              enabledNode = this.provider.getNode(`${pipePath}/enabled`);

            enabledNode.updateValue(true);
          });

          emitter.on('disable', () => {
            enabled = false;
            if(!enabledNode)
              enabledNode = this.provider.getNode(`${pipePath}/enabled`);

            enabledNode.updateValue(false);
          });

          emitter.on('close', () => {
            enabled = false;
            stream.close();

            this.provider.removeNode(pipePath);
            emitter.removeAllListeners();
          });

          this.provider.addNode(pipePath, generatePipe(params.rawDataAction, emitter));

          resolve([[true, '']]);
        }

        if(update.error)
          return;

        update.updates.forEach((row) => {
          if(Object.keys(row).length !== 3)
            return;
          output.sendMessage([row.status, row.data, row.data2]);
        });
      });
    });
  }
}

CreatePipeAction.profileName = "createPipe";
