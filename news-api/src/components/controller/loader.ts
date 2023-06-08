import { IOptions, IRequest, CallbackFunction, DataType } from '../../types/types';

class Loader {
  private baseLink: string;
  private options: IOptions;

  constructor(baseLink: string, options: IOptions) {
    this.baseLink = baseLink;
    this.options = options;
  }

  protected getResp(
    request: Partial<IRequest>,
    callback: CallbackFunction = (): void => {
      console.error('No callback for GET response');
    }
  ): void {
    this.load('GET', request, callback);
  }

  private errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  private makeUrl(request: Partial<IRequest>): string {
    const urlOptions: IOptions = { ...this.options, ...request.options };
    let url = `${this.baseLink}${request.endpoint}?`;

    Object.keys(urlOptions).forEach((key: keyof IOptions): void => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load(method: string, request: Partial<IRequest>, callback: CallbackFunction): void {
    fetch(this.makeUrl(request), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data: DataType) => callback(data))
      .catch((err: Error) => console.error(err));
  }
}

export default Loader;
