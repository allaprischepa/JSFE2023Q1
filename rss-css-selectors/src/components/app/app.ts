import { Page } from '../page/page';

export class App {
  private page;

  constructor() {
    this.page = new Page();
  }

  public start(): void {
    this.page.init();
  }
}
