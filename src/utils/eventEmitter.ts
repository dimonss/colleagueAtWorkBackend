import { EventEmitter } from 'events';

class StatusEventEmitter extends EventEmitter {
  private static instance: StatusEventEmitter;

  private constructor() {
    super();
  }

  public static getInstance(): StatusEventEmitter {
    if (!StatusEventEmitter.instance) {
      StatusEventEmitter.instance = new StatusEventEmitter();
    }
    return StatusEventEmitter.instance;
  }

  public emitStatusChange(colleagueId: number, isAtWork: boolean): void {
    this.emit('statusChange', { colleagueId, isAtWork });
  }

  public emitInitialData(colleagues: any[]): void {
    this.emit('initialData', { colleagues });
  }
}

export default StatusEventEmitter; 