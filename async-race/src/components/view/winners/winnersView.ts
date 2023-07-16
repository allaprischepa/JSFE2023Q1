import View from '../view';

export default class WinnersView extends View {
  constructor() {
    super('winners');
  }

  public getViewContent(): Element {
    const content = document.createElement('div');
    content.classList.add(`${this.type}-content`);
    content.innerText = this.type.toUpperCase();

    return content;
  }
}
