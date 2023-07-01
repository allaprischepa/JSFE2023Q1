import { EditorView } from 'codemirror';
import { Events, Selectors } from '../../types/types';
import {
  getClassSelector,
  getChildElementByTagNumber,
  findOpeningClosinTags,
  findLineWithParentTag,
  getIndexOfCertainElement,
  findCorrespondingLine,
  compareNodeLists,
} from '../../utils/utils';
import { Description } from '../description/description';
import { Editor } from '../editor/editor';
import { GameBoard } from '../gameboard/gameboard';
import { Page } from '../page/page';
import { GameStorage } from './gamestorage';
import { LevelLoader } from './levelloader';
import { levels } from './levels';

export class Game {
  private loader: LevelLoader;
  private storage: GameStorage;
  private editor: Editor;
  private gameboard: GameBoard;
  private description: Description;
  private level: number;
  private htmlEditor: EditorView;
  private tableElement: Element;

  constructor(page: Page) {
    [
      this.loader,
      this.storage,
      this.editor,
      this.gameboard,
      this.description,
      this.level,
      this.htmlEditor,
      this.tableElement,
    ] = this.init(page);
  }

  private init(page: Page): [LevelLoader, GameStorage, Editor, GameBoard, Description, number, EditorView, Element] {
    const loader = new LevelLoader(page);
    const storage = new GameStorage();
    const editor = page.getEditor();
    const gameboard = page.getGameboard();
    const description = page.getDescription();
    const level = storage.getCurrentLevel();
    const htmlEditor = editor.getHtmlEditor();
    const tableElement = gameboard.getTable();

    return [loader, storage, editor, gameboard, description, level, htmlEditor, tableElement];
  }

  public play(): void {
    this.storage.updateStateForLevels(levels);
    this.playLevel(this.level);
    this.listenUserInput();
    this.listenHtmlViewEvents();
    this.listenResetProgress();
    this.listenHelpButton();
    this.listenTableEvents();
  }

  private listenUserInput(): void {
    const input = this.editor.getInput();
    const btn = this.editor.getInputButton();

    input.addEventListener('input', () => {
      if (input.value) input.classList.remove('blink');
      else input.classList.add('blink');
    });

    input.addEventListener('keypress', (event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Enter') {
          this.checkAnswer(input.value);
        }
      }
    });

    btn.addEventListener('click', () => {
      this.checkAnswer(input.value);
    });
  }

  private checkAnswer(inputStr: string): void {
    const data = levels[this.level];
    const rightAnswer = data.selector;
    const reference = this.tableElement.querySelectorAll(rightAnswer);
    let checked = false;

    try {
      const selected = this.tableElement.querySelectorAll(inputStr);
      checked = compareNodeLists(selected, reference);
    } catch (err) {
      console.error(err);
    }

    if (checked) {
      this.markLevelAsPassed(this.level);
      reference.forEach((node) => {
        node.classList.add('fly');
      });
      setTimeout(() => {
        this.playNext();
      }, 500);
    } else {
      const editorWrapper = this.editor.getEditorWrapperElement();
      editorWrapper.classList.add(Selectors.tremble);
      setTimeout(() => {
        editorWrapper.classList.remove(Selectors.tremble);
      }, 500);
    }
  }

  private listenHtmlViewEvents(): void {
    this.htmlEditor.contentDOM.addEventListener('mousemove', (event) => {
      this.removeHighlighted();
      const editorText = this.htmlEditor.state.doc.toString();
      const splitedText = editorText.split('\n');
      const pos = this.htmlEditor.posAtCoords({ x: event.clientX, y: event.clientY });
      const linesToExclude = [1, splitedText.filter((str) => str.trim()).length];

      if (pos) {
        const line = this.htmlEditor.state.doc.lineAt(pos);

        if (!linesToExclude.includes(line.number)) {
          const lineText = line.text.trim();
          this.highlightEditorAndTable(lineText, line.number);
        }
      }
    });

    this.htmlEditor.contentDOM.addEventListener('mouseout', () => this.removeHighlighted());
  }

  private playNext(): void {
    const nextLevel = this.findNotPassedLevel(this.level);

    if (levels[nextLevel]) {
      this.playLevel(nextLevel);
    } else {
      const notPassedLevel = this.findNotPassedLevel();

      if (levels[notPassedLevel]) {
        this.playLevel(notPassedLevel);
      } else {
        this.markLevelAsPassed(this.level);
        this.clearInput();
        this.showWinMessage();
      }
    }
  }

  private playLevel(level: number): void {
    this.storage.setCurrentLevel(level);
    this.level = level;

    const state = this.storage.getState(levels);
    const levelsList = this.description.getLevelsList();

    this.clearInput();
    this.loader.setLevel(level);
    this.loader.setState(state, level);

    const levelItems = levelsList.querySelectorAll(getClassSelector(Selectors.levelItem));

    if (levelItems) {
      levelItems.forEach((item) => {
        item.addEventListener(Events.loadlevel, (event) => {
          const target = event.target;

          if (target instanceof Element) {
            const dataLevel = target.getAttribute('data-level');
            const levelNum = dataLevel ? +dataLevel : -1;

            if (levels[levelNum]) {
              this.playLevel(levelNum);
            }
          }
        });
      });
    }
  }

  private markLevelAsPassed(level: number): void {
    const data = levels[level];
    const lvlID = `${data.selector}${data.htmlMarkup}`;
    const levelsList = this.description.getLevelsList();
    const levelItem = levelsList.querySelector(`[data-level="${this.level}"]`);
    levelItem?.classList.add(Selectors.passed);

    this.storage.updateState(lvlID, 1);
  }

  private listenResetProgress(): void {
    const reset = this.description.getResetProgressButton();

    reset.addEventListener('click', () => {
      this.storage.clear();
      this.playLevel(0);
    });
  }

  private findNotPassedLevel(startFrom = -1): number {
    const state = this.storage.getState(levels);

    return state.findIndex((obj, ind) => obj.passed === 0 && ind > startFrom);
  }

  private clearInput(): void {
    const input = this.editor.getInput();

    input.value = '';
    input.dispatchEvent(new Event('input'));
  }

  private showWinMessage(): void {
    const message = document.createElement('div');
    message.classList.add('win-message');
    message.innerHTML = '<span>You won!</span><span>Good job!</span>';

    this.tableElement.replaceChildren(message);
  }

  private listenHelpButton(): void {
    const helpBtn = this.gameboard.getHelpButton();

    helpBtn.addEventListener('click', () => {
      this.printAnswer();
      this.markLevelWithHelp(this.level);
    });
  }

  private markLevelWithHelp(level: number): void {
    const data = levels[level];
    const lvlID = `${data.selector}${data.htmlMarkup}`;
    const levelsList = this.description.getLevelsList();
    const levelItem = levelsList.querySelector(`[data-level="${level}"]:not(${getClassSelector(Selectors.passed)})`);

    if (levelItem) {
      levelItem.classList.add(Selectors.withHelp);
      this.storage.updateStateWithHelp(lvlID);
    }
  }

  private printAnswer(): void {
    const input = this.editor.getInput();
    const data = levels[this.level];
    const answer = data.selector;

    input.value = '';
    input.classList.remove('blink');
    input.focus();

    for (let i = 0; i < answer.length; i += 1) {
      setTimeout(() => {
        input.value += answer[i];
      }, i * 150);
    }
  }

  private listenTableEvents(): void {
    this.tableElement.addEventListener('mouseover', (event) => {
      this.removeHighlighted();
      const target = event.target;

      if (target instanceof Element) {
        const currentTag = target.tagName.toLowerCase();
        const tableElements = this.tableElement.getElementsByTagName(currentTag);
        const index = getIndexOfCertainElement(Array.from(tableElements), target);
        const editorText = this.htmlEditor.state.doc.toString();
        const splitedText = editorText.split('\n');

        if (index >= 0) {
          const lineNumber = findCorrespondingLine(editorText, currentTag, index);

          if (lineNumber >= 0) {
            const lineText = splitedText[lineNumber];
            this.highlightEditorAndTable(lineText, lineNumber + 1);
          }
        }
      }
    });

    this.tableElement.addEventListener('mouseout', () => this.removeHighlighted());
  }

  private removeHighlighted(): void {
    const highlight = Selectors.highlight;
    const tooltip = this.gameboard.getTooltip();

    const highlightedOnEditor = this.htmlEditor.dom.querySelectorAll(`.${highlight}`);
    const highlightedOnTable = this.tableElement.querySelectorAll(`.${highlight}`);
    [...highlightedOnEditor, ...highlightedOnTable].forEach((line) => line.classList.remove(highlight));

    tooltip.classList.remove('show');
  }

  private highlightEditorAndTable(lineText: string, lineNumber: number): void {
    const highlight = Selectors.highlight;
    const lineSelector = getClassSelector(Selectors.editorLine);
    const editorText = this.htmlEditor.state.doc.toString();
    const tooltip = this.gameboard.getTooltip();

    const range = (start: number, stop: number, step = 1): number[] =>
      Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

    const highlightCorrespondingTableElement = (openeningTag: string, lineNumber: number): void => {
      const editorText = this.htmlEditor.state.doc.toString();
      const splitedText = editorText.split('\n');
      const aboveHtml = splitedText.slice(1, lineNumber - 1);
      const num = aboveHtml.filter((str) => str.includes(`<${openeningTag}`)).length;

      if (num >= 0) {
        const elementFromTable = getChildElementByTagNumber(this.tableElement, openeningTag, num);

        if (elementFromTable) {
          elementFromTable.classList.add(highlight);
          const tooltipData = elementFromTable.getAttribute('data-tooltip');

          if (tooltipData) {
            tooltip.textContent = tooltipData;
            tooltip.classList.add('show');

            if (tooltip instanceof HTMLElement && elementFromTable instanceof HTMLElement) {
              const rect = this.tableElement.getBoundingClientRect();
              const elemWidth = elementFromTable.offsetWidth;
              const tooltipWidth = tooltip.offsetWidth;

              let offsetLeft = elementFromTable.offsetLeft;
              let parent = elementFromTable.offsetParent;

              while (parent !== this.tableElement) {
                offsetLeft += parent && parent instanceof HTMLElement ? parent.offsetLeft : 0;
                parent = parent && parent instanceof HTMLElement ? parent.offsetParent : null;
              }

              const top = Math.floor(rect.top + elementFromTable.offsetTop - 60);
              const left = Math.floor(rect.left + offsetLeft + elemWidth / 2 - tooltipWidth / 2);

              tooltip.style.top = `${top}px`;
              tooltip.style.left = `${left}px`;
            }
          }
        }
      }
    };

    const highlightEditorLines = (from: number, to?: number): void => {
      const lines = this.htmlEditor.dom.querySelectorAll(lineSelector);

      if (lines) {
        if (to) {
          range(from, to).forEach((num) => {
            lines.item(num).classList.add(highlight);
          });
        } else {
          lines.item(from).classList.add(highlight);
        }
      }
    };

    if (lineText) {
      const [openeningTag, closingTag] = findOpeningClosinTags(lineText);

      if (openeningTag) {
        highlightCorrespondingTableElement(openeningTag, lineNumber);

        if (closingTag) {
          highlightEditorLines(lineNumber - 1);
        } else {
          // Find line with closing tag...
          const searchedLine = findLineWithParentTag(openeningTag, editorText, lineNumber - 1, false);

          if (searchedLine > 0) {
            highlightCorrespondingTableElement(openeningTag, lineNumber);
            highlightEditorLines(lineNumber - 1, searchedLine - 1);
          }
        }
      } else if (closingTag) {
        // Find line with opening tag...
        const searchedLine = findLineWithParentTag(closingTag, editorText, lineNumber - 1);

        if (searchedLine > 0) {
          highlightCorrespondingTableElement(closingTag, searchedLine);
          highlightEditorLines(searchedLine - 1, lineNumber - 1);
        }
      }
    }
  }
}
