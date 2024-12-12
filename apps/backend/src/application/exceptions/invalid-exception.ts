import Exception from './exception';

class InvalidException extends Exception {
  constructor(message: string) {
    super('invalid', message);
  }
}

export default InvalidException;
