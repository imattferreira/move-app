import Exception from './exception';

class ConflictException extends Exception {
  constructor(message: string) {
    super('conflict', message);
  }
}

export default ConflictException;
