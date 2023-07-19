import APIClient from '../apiclient/apiclient';

export default abstract class View {
  private viewType: string;

  // private viewContent: Element;

  private viewClient: APIClient;

  constructor(type: string) {
    this.viewType = type;
    this.viewClient = new APIClient();
    // this.viewContent = ;
  }

  public get type() { return this.viewType; }

  public get client() { return this.viewClient; }

  public get content() { return this.getViewContent(); }

  abstract getViewContent(): Element;
}
