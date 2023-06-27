import { ILevel, ILevelState } from '../../types/types';
import { Description } from '../description/description';
import { Editor } from '../editor/editor';
import { GameBoard } from '../gameboard/gameboard';
import { Page } from '../page/page';
import { levels } from './levels';
import { addClosingTag, addClassToSelector } from '../../utils/utils';
import { EditorView } from 'codemirror';

export class LevelLoader {
  private gameboard: GameBoard;
  private description: Description;
  private editor: Editor;

  constructor(page: Page) {
    this.gameboard = page.getGameboard();
    this.description = page.getDescription();
    this.editor = page.getEditor();
  }

  public setLevel(level: number): void {
    const data = levels[level];

    this.setTaskHeader(data);
    this.setDescription(data, level);
    this.setHtmlView(data);
    this.setOnTable(data);
  }

  private setTaskHeader(data: ILevel): void {
    const header = this.gameboard.getHeader();
    header.textContent = data.taskHeader;
  }

  private setDescription(data: ILevel, level: number): void {
    this.setHeader(level);
    this.setTitle(data);
    this.setSubtitle(data);
    this.setSyntax(data);
    this.setHelp(data);
    this.setExamples(data);
  }

  private setHeader(level: number): void {
    const total = levels.length;
    const header = this.description.getHeader();
    header.textContent = `Level ${level + 1} of ${total}`;
  }

  private setTitle(data: ILevel): void {
    const title = this.description.getTitle();
    title.textContent = data.title;
  }

  private setSubtitle(data: ILevel): void {
    const subtitle = this.description.getSubtitle();
    subtitle.textContent = data.subtitle;
  }

  private setSyntax(data: ILevel): void {
    const syntax = this.description.getSyntax();
    syntax.textContent = data.syntax;
  }

  private setHelp(data: ILevel): void {
    const help = this.description.getHelp();
    help.innerHTML = data.help;
  }

  private setExamples(data: ILevel): void {
    const eContainer = this.description.getExamplesContainer();
    eContainer.innerHTML = '';

    data.examples.forEach((example) => {
      const exampleWrapper = document.createElement('div');
      exampleWrapper.classList.add('example');
      exampleWrapper.innerHTML = example;
      eContainer.append(exampleWrapper);
    });
  }

  private setHtmlView(data: ILevel): void {
    const htmlEditor = this.editor.getHtmlEditor();
    const newText = `<div class="table">\n${addClosingTag(data.htmlMarkup)}\n</div>`;

    this.replaceFormattedText(htmlEditor, newText);
    this.editor.updateToMinNumberOfLines(htmlEditor);
  }

  private setOnTable(data: ILevel): void {
    const table = this.gameboard.getTable();
    table.innerHTML = this.prepareHtmlMarkup(data);
  }

  private prepareHtmlMarkup(data: ILevel): string {
    const markup = data.htmlMarkup;
    const selector = data.selector;
    let replaced = addClosingTag(markup);
    replaced = addClassToSelector(replaced, selector, 'shake');

    return replaced;
  }

  private replaceFormattedText(editor: EditorView, text: string): void {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.toString().length,
        insert: text,
      },
    });
  }

  public setState(state: ILevelState[], crrntLvl: number): void {
    const stateElement = this.description.getState();
    const lvlDescription = this.description.getDescription();

    state.forEach((data, ind) => {
      console.log(data.passed);
      const lvlState = document.createElement('div');
      lvlState.classList.add('state__item');
      if (ind === crrntLvl) lvlState.classList.add('current');
      if (data.passed) lvlState.classList.add('passed');

      const checkMark = document.createElement('span');
      checkMark.classList.add('checkmark');

      const text = document.createElement('span');
      text.innerText = `Level ${ind + 1}`;

      const infoBtn = document.createElement('a');
      infoBtn.classList.add('level-info');
      infoBtn.addEventListener('click', () => {
        lvlDescription.classList.add('open');
      });

      lvlState.append(checkMark, text, infoBtn);
      stateElement.append(lvlState);
    });
  }
}
