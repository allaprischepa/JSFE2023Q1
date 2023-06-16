import { getClassSelector } from '../../../utils/utils';

export class PageSide {
  private _side: string;
  private _element: Element;

  constructor(side: string) {
    this._side = side;
    this._element = this.getElement();
  }

  public get side(): string {
    return this._side;
  }

  public get element(): Element {
    return this._element;
  }

  private getElement(): Element {
    const selector = getClassSelector(this.side);
    const existed = document.querySelector(selector);

    if (existed) return existed;

    const element = document.createElement('div');
    element.classList.add(this.side);
    document.body.append(element);

    return element;
  }
}
