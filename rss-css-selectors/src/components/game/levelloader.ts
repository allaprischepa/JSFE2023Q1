import { Events, ILevel, ILevelState, Selectors } from '../../types/types';
import { Description } from '../description/description';
import { Editor } from '../editor/editor';
import { GameBoard } from '../gameboard/gameboard';
import { Page } from '../page/page';
import { levels } from './levels';
import { addClosingTag, addClassToSelector, getStructuredHtml, addAttributeWithElementHtml } from '../../utils/utils';
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
    const newText = getStructuredHtml(`<div class="table">\n${addClosingTag(data.htmlMarkup)}\n</div>`);

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
    replaced = addAttributeWithElementHtml(replaced);
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
    const levelsList = this.description.getLevelsList();
    const lvlDescription = this.description.getDescription();
    levelsList.innerHTML = '';

    levels.forEach((lvlData, ind) => {
      const lvlID = `${lvlData.selector}${lvlData.htmlMarkup}`;
      const data = state.filter((st) => st.key === lvlID).shift();

      const levelloadEvent = new Event(Events.loadlevel);

      const lvlState = document.createElement('div');
      lvlState.classList.add(Selectors.levelItem);
      lvlState.setAttribute('data-level', `${ind}`);

      if (data?.passed) lvlState.classList.add(Selectors.passed);

      const checkMark = document.createElement('span');
      checkMark.classList.add('checkmark');

      const text = document.createElement('span');
      text.innerText = `Level ${ind + 1}`;

      lvlState.append(checkMark, text);

      if (ind === crrntLvl) {
        const infoBtn = document.createElement('a');
        lvlState.classList.add('current');

        infoBtn.classList.add('level-info');
        infoBtn.addEventListener('click', () => {
          lvlDescription.classList.add('open');
        });

        lvlState.append(infoBtn);
      } else {
        lvlState.addEventListener('click', (event) => event.currentTarget?.dispatchEvent(levelloadEvent));
      }

      levelsList.append(lvlState);
    });
  }
}
