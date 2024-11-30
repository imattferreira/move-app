// Framework & Adapter (Clean Arch)
import express, { type Request, type Response, type Express } from 'express';
import { camelfy, snakefy } from '~/utils/object';
import type { Object } from '~/utils/types';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Handler<I extends Object, O> = (data: I) => Promise<O>;

export default interface HttpServer {
  register<I extends Object, O>(
    method: HttpMethods,
    endpoint: string,
    callback: Handler<I, O>
  ): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();

    this.app.use(express.json());
  }

  async register<I extends Object, O>(
    method: HttpMethods,
    endpoint: string,
    callback: Handler<I, O>
  ): Promise<void> {
    const m = method.toLowerCase() as
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete';
    const route = endpoint.replace(/\{\}/g, '');
    const handler = async (req: Request, res: Response) => {
      try {
        const data = {
          ...req.params,
          ...req.body
        };
        const input = camelfy(data) as I;

        const output = await callback(input);

        if (!output) {
          return res.send();
        }

        res.json(snakefy(output));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (err: any) {
        res.status(422).json({ message: err.message });
      }
    };

    this.app[m](route, handler);
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
