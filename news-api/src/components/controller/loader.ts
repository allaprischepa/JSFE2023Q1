import { IOptions, IRequest, CallbackFunction } from '../../types/types';

class Loader {
  baseLink: string;
  options: IOptions;

  constructor(baseLink: string, options: IOptions) {
    this.baseLink = baseLink;
    this.options = options;
  }

  getResp(
    request: IRequest,
    callback: CallbackFunction = () => {
      console.error('No callback for GET response');
    }
  ): void {
    this.load('GET', request, callback);
  }

  errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  makeUrl(request: IRequest): string {
    const urlOptions: IOptions = { ...this.options, ...request.options };
    let url = `${this.baseLink}${request.endpoint}?`;

    Object.keys(urlOptions).forEach((key: keyof IOptions): void => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  load(method: string, request: IRequest, callback: CallbackFunction): void {
    fetch(this.makeUrl(request), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch((err) => console.error(err));
  }
}

export default Loader;
