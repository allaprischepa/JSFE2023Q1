import { capitalize, createElement } from '../../utils/utils';
import GarageView from '../view/garage/garageView';
import WinnersView from '../view/winners/winnersView';

export default class App {
  private tabs;

  constructor() {
    this.tabs = [
      new GarageView(),
      new WinnersView(),
    ];
  }

  public start():void {
    const nav = createElement('nav');
    const main = createElement('main');

    this.tabs.forEach((tab, ind) => {
      const input = createElement('input', ['tab_input'], { type: 'radio', name: 'tabs', id: `tab_input-${ind}` });
      const label = createElement('label', ['tab'], { for: input.id, id: `tab-${ind}` });
      const article = createElement('article', ['tab_content'], { id: `tab_content-${ind}` });

      if (ind === 0 && input instanceof HTMLInputElement) input.checked = true;
      label.innerText = capitalize(tab.type);

      article.append(tab.content);
      document.body.append(input);
      nav.append(label);
      main.append(article);
    });

    document.body.append(nav);
    document.body.append(main);
  }
}
