import Exception from './exception';

class ForbiddenException extends Exception {
  constructor(message: string) {
    super('forbidden', message);
  }
}

export default ForbiddenException;
