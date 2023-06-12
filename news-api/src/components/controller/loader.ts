import { IOptions, IRequest, CallbackFunction, IDataSources, IDataNews } from '../../types/types';

class Loader {
  private baseLink: string;
  private options: Partial<IOptions>;

  constructor(baseLink: string, options: Partial<IOptions>) {
    this.baseLink = baseLink;
    this.options = options;
  }

  protected getResp(
    request: Partial<IRequest>,
    callback: CallbackFunction<IDataNews> | CallbackFunction<IDataSources> = (): void => {
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
    const urlOptions: Partial<IOptions> = { ...this.options, ...request.options };
    let url = `${this.baseLink}${request.endpoint}?`;

    Object.keys(urlOptions).forEach((key: keyof IOptions): void => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load(
    method: string,
    request: Partial<IRequest>,
    callback: CallbackFunction<IDataSources> | CallbackFunction<IDataNews>
  ): void {
    fetch(this.makeUrl(request), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then(callback)
      .catch((err: Error) => console.error(err));
  }
}

export default Loader;
