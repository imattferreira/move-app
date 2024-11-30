export type Reasons = 'not_found' | 'conflict' | 'invalid' | 'forbidden';

abstract class Exception extends Error {
  constructor(readonly reason: Reasons, readonly message: string) {
    super(reason);
    this.message = `${reason}__${message}`;
  }
}

export default Exception;
