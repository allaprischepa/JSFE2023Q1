import capitalize from '../../utils/utils';
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
    const nav = document.createElement('nav');
    const main = document.createElement('main');

    this.tabs.forEach((tab, ind) => {
      const input = document.createElement('input');
      input.classList.add('tab_input');
      input.setAttribute('type', 'radio');
      input.name = 'tabs';
      input.id = `tab_input-${ind}`;
      if (ind === 0) input.checked = true;

      const label = document.createElement('label');
      label.classList.add('tab');
      label.setAttribute('for', input.id);
      label.id = `tab-${ind}`;
      label.innerText = capitalize(tab.type);

      const article = document.createElement('article');
      article.classList.add('tab_content');
      article.id = `tab_content-${ind}`;
      article.append(tab.content);

      document.body.append(input);
      nav.append(label);
      main.append(article);
    });

    document.body.append(nav);
    document.body.append(main);
  }
}
