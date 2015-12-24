import DS, { SimpleNode } from 'dslink';

export class PipeEnableAction extends SimpleNode.class {
  static factory(path, provider) {
    return new PipeEnableAction(path, provider);
  }

  load(input) {
    if(input && input['?emitter']) {
      this.emitter = input['?emitter'];
    }

    super.load(input);
  }

  onInvoke(params) {
    this.emitter.emit('enable');
  }
}

export class PipeDisableAction extends SimpleNode.class {
  static factory(path, provider) {
    return new PipeDisableAction(path, provider);
  }

  load(input) {
    if(input && input['?emitter']) {
      this.emitter = input['?emitter'];
    }

    super.load(input);
  }

  onInvoke(params) {
    this.emitter.emit('disable');
  }
}

export class PipeCloseAction extends SimpleNode.class {
  static factory(path, provider) {
    return new PipeCloseAction(path, provider);
  }

  load(input) {
    if(input && input['?emitter']) {
      this.emitter = input['?emitter'];
    }

    super.load(input);
  }

  onInvoke(params) {
    this.emitter.emit('close');
  }
}

PipeEnableAction.profileName = 'pipeEnable';
PipeDisableAction.profileName = 'pipeDisable';
PipeCloseAction.profileName = 'pipeClose';
