import { IDataNews, IDataSources } from '../../types/types';
import { getElement } from '../../utils/utils';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
  private controller: AppController;
  private view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    const sources = getElement('.sources');
    if (sources) {
      sources.addEventListener('click', (e: MouseEvent): void =>
        this.controller.getNews(e, (data: IDataNews): void => this.view.drawNews(data))
      );
      this.controller.getSources((data: IDataSources): void => this.view.drawSources(data));
    }
  }
}

export default App;
