// Framework & Adapter (Clean Arch)
import express, { type Request, type Response, type Express } from 'express';
import { camelfy, snakefy } from '../../utils/object';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Handler<T> = (data: T) => void;

export default interface HttpServer {
  register<T>(method: HttpMethods, endpoint: string, callback: Handler<T>): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();

    this.app.use(express.json());
  }

  async register(
    method: HttpMethods,
    endpoint: string,
    callback: Function
  ): Promise<void> {
    const m = method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
    const route = endpoint.replace(/\{\}/g, '');
    const handler = async (req: Request, res: Response) => {
      try {
        const input = {
          ...req.params,
          ...req.body
        };

        const output = callback(camelfy(input));

        res.json(snakefy(output));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        res.status(422).json({ message: err.message });
      }
    };

    this.app[m](route, handler);
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
