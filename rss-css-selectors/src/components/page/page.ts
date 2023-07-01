import { Selectors } from '../../types/types';
import { Description } from '../description/description';
import { Editor } from '../editor/editor';
import { GameBoard } from '../gameboard/gameboard';
import { PageSide } from './pageside/pageside';

export class Page {
  private leftSide: PageSide;
  private rightSide: PageSide;
  private gameboard: GameBoard;
  private editor: Editor;
  private description: Description;

  constructor() {
    [this.leftSide, this.rightSide, this.gameboard, this.editor, this.description] = this.init();
  }

  private init(): [PageSide, PageSide, GameBoard, Editor, Description] {
    const leftSide = new PageSide('left');
    const rightSide = new PageSide('right');
    const gameboard = new GameBoard();
    const editor = new Editor();
    const description = new Description();

    return [leftSide, rightSide, gameboard, editor, description];
  }

  public view(): void {
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
    const template = document.getElementById(Selectors.footerContent);

    if (template && template instanceof HTMLTemplateElement) {
      const content = template.content;

      if (content) {
        const footerLinks = content.childNodes;
        if (footerLinks) footer.append(...footerLinks);
      }
    }
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
