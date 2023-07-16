export default class APIClient {
  private baseURL = 'http://127.0.0.1:3000';

  private path: string;

  private endpoint: string;

  constructor(path: string) {
    this.path = path;
    this.endpoint = `${this.baseURL}/${this.path}`;
  }

  public getData() {
    return fetch(this.endpoint);
  }
}
