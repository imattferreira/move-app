// Framework & Adapter (Clean Arch)
import { camelfy, snakefy } from '~/utils/object';
import express, { type Express, type Request, type Response } from 'express';
import Exception from '~/application/exceptions/exception';
import type { Object } from '~/utils/types';
import type { Server } from 'http';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Handler<I extends Object, O> {
  execute(data: I): Promise<O>;
}

export default interface HttpServer {
  register<I extends Object, O>(
    method: HttpMethods,
    endpoint: string,
    callback: Handler<I, O>
  ): void;
  listen(port: number): void;
  close(): void;
}

export class ExpressHttpServerAdapter implements HttpServer {
  private app: Express;
  private server?: Server;

  constructor() {
    this.app = express();

    this.app.use(express.json());
  }

  close(): void {
    this.server?.close();
  }

  async register<I extends Object, O>(
    method: HttpMethods,
    endpoint: string,
    handler: Handler<I, O>
  ): Promise<void> {
    const m = method.toLowerCase() as
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete';
    const route = endpoint.replace(/{|}/g, '');
    const callback = async (req: Request, res: Response) => {
      try {
        const data = {
          ...req.params,
          ...req.body
        };
        const input = camelfy(data) as I;

        const output = await handler.execute(input);

        if (!output) {
          return res.send();
        }

        res.json(snakefy(output));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (err: any) {
        const { status, message } = this.parseException(err);

        res.status(status).json({ message });
      }
    };

    this.app[m](route, callback);
  }

  listen(port: number): void {
    this.server = this.app.listen(port);
  }

  private parseException(
    exception: Exception
  ): { status: number; message: string } {
    switch (exception?.reason) {
      case 'invalid':
        return { status: 400, message: exception.getMessage() };
      case 'forbidden':
        return { status: 403, message: exception.getMessage() };
      case 'not_found':
        return { status: 404, message: exception.getMessage() };
      case 'conflict':
        return { status: 409, message: exception.getMessage() };
      default:
        return { status: 500, message: 'internal server error' };
    }
  }
}
