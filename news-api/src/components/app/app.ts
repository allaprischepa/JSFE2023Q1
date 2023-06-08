import { IData } from '../../types/types';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
  controller;
  view;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    const sources = document.querySelector('.sources');
    if (sources) {
      sources.addEventListener('click', (e): void =>
        this.controller.getNews(e, (data: IData): void => this.view.drawNews(data))
      );
      this.controller.getSources((data: IData): void => this.view.drawSources(data));
    }
  }
}

export default App;
