import Exception from './exception';

class NotFoundException extends Exception {
  constructor(message: string) {
    super('not_found', message);
  }
}

export default NotFoundException;
