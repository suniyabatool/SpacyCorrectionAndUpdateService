import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class EmitterUtil {
  private static eventEmitters: { [ID: string]: EventEmitter<any> } = {};

  static get(ID: string): EventEmitter<any> {
    if (!this.eventEmitters[ID])
      this.eventEmitters[ID] = new EventEmitter();
    return this.eventEmitters[ID];
  }
}
