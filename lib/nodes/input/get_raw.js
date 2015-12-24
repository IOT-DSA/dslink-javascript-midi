import DS, { SimpleNode, AsyncTableResult, StreamStatus } from 'dslink';

import { inputColumns } from '../../structure';

export class GetRawAction extends SimpleNode.class {
  static factory(path, provider) {
    return new GetRawAction(path, provider);
  }

  load(input) {
    if(input && input['?input']) {
      this.inputObj = input['?input'];
    }

    super.load(input);
  }

  onInvoke(params) {
    try {
    const result = new AsyncTableResult(inputColumns);

    setTimeout(() => {
      this.inputObj.input.on('message', function(stamp, message) {
        result.update([{
          status: message[0],
          data: message[1],
          data2: message[2]
        }]);
      });

      result.update([], StreamStatus.open);
    }, 0);

    return result;
  } catch(e) { console.log(e); }
  }
}

GetRawAction.profileName = "getRaw";
