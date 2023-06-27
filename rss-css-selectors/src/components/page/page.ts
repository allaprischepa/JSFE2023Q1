import { Description } from '../description/description';
import { Editor } from '../editor/editor';
import { GameBoard } from '../gameboard/gameboard';
import { PageSide } from './pageside/pageside';

export class Page {
  private leftSide;
  private rightSide;
  private gameboard;
  private editor;
  private description;

  constructor() {
    this.leftSide = new PageSide('left');
    this.rightSide = new PageSide('right');
    this.gameboard = new GameBoard();
    this.editor = new Editor();
    this.description = new Description();
  }

  public init(): void {
    this.view();
  }

  private view(): void {
    const leftSide = this.leftSide.element;
    const rightSide = this.rightSide.element;

    this.viewHeader(leftSide);
    this.gameboard.view(leftSide);
    this.editor.view(leftSide);
    this.viewFooter(leftSide);

    this.description.view(rightSide);
  }

  private viewHeader(parent: Element = document.body): void {
    const header = document.createElement('header');
    header.innerHTML = '<h1 class="site-name">RSS CSS Selectors</h1>';

    parent.append(header);
  }

  private viewFooter(parent: Element = document.body): void {
    const footer = document.createElement('footer');

    this.addFooterLinks(footer);
    parent.append(footer);
  }

  private addFooterLinks(footer: Element): void {
    [1, 2, 3].forEach((item) => {
      const footerItem = document.createElement('div');
      footerItem.classList.add('footer__item');

      let itemChild = null;
      let itemChild2 = null;

      switch (item) {
        case 1:
          itemChild = document.createElement('a');
          itemChild.href = 'https://rs.school/js/';
          itemChild.classList.add('footer__link');
          itemChild.title = 'Rolling Scopes School';
          itemChild.target = '_blank';

          itemChild2 = document.createElement('span');
          itemChild2.classList.add('footer__icon', 'link__rss');

          itemChild.append(itemChild2);

          break;

        case 2:
          itemChild = document.createElement('a');
          itemChild.href = 'https://github.com/allaprischepa';
          itemChild.classList.add('footer__link');
          itemChild.title = 'GitHub';
          itemChild.target = '_blank';

          itemChild2 = document.createElement('span');
          itemChild2.classList.add('footer__icon', 'link__github');

          itemChild.append(itemChild2);
          itemChild.append(document.createTextNode('@allaprischepa'));

          break;

        case 3:
          itemChild = document.createElement('span');
          itemChild.classList.add('copyright');
          itemChild.textContent = '2023';

          break;

        default:
      }

      if (itemChild) {
        footerItem.append(itemChild);
        footer.append(footerItem);
      }
    });
  }

  public getGameboard(): GameBoard {
    return this.gameboard;
  }

  public getEditor(): Editor {
    return this.editor;
  }

  public getDescription(): Description {
    return this.description;
  }
}
