import { Selectors } from '../../types/types';
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
  private level: number;

  constructor(page: Page) {
    this.loader = new LevelLoader(page);
    this.storage = new GameStorage();
    this.editor = page.getEditor();
    this.gameboard = page.getGameboard();
    this.level = this.storage.getCurrentLevel();
  }

  public play(): void {
    this.playLevel(this.level);
    this.listenUserInput();
    this.listenHtmlViewEvents();
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
    const table = this.gameboard.getTable();
    const reference = table.querySelectorAll(rightAnswer);
    let checked = false;

    try {
      const selected = table.querySelectorAll(inputStr);

      if (selected.length === reference.length) {
        const selectedArr = Array.from(selected);
        const referenceArr = Array.from(reference);

        checked = referenceArr.every((node, ind) => node.isSameNode(selectedArr[ind]));
      }
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
    const htmlEditor = this.editor.getHtmlEditor();
    const highlight = Selectors.highlight;
    const lineClass = 'cm-line';
    const removeHighlighted = (): void => {
      const highlighted = htmlEditor.dom.querySelectorAll(`.${highlight}`);
      highlighted.forEach((line) => line.classList.remove(highlight));
    };

    htmlEditor.contentDOM.addEventListener('mousemove', (event) => {
      removeHighlighted();
      const pos = htmlEditor.posAtCoords({ x: event.clientX, y: event.clientY });

      if (pos) {
        const line = htmlEditor.state.doc.lineAt(pos);
        const lineText = line.text;
        const node = htmlEditor.domAtPos(pos);
        const parent = node.node.parentElement;

        if (lineText && parent) {
          const lineElement = parent.closest(`.${lineClass}`);
          lineElement?.classList.add(highlight);
        }
      }
    });
    htmlEditor.contentDOM.addEventListener('mouseout', () => {
      removeHighlighted();
    });
  }

  private playNext(): void {
    const nextLevel = this.level + 1;

    if (levels[nextLevel]) {
      this.storage.setCurrentLevel(nextLevel);
      this.level = nextLevel;
      this.playLevel(this.level);
    } else {
      console.log('Find not passed level...');
    }
  }

  private playLevel(level: number): void {
    const state = this.storage.getState(levels);

    this.loader.setLevel(level);
    this.loader.setState(state, level);
  }

  private markLevelAsPassed(level: number): void {
    const data = levels[level];
    const lvlID = `${data.selector}${data.htmlMarkup}`;

    this.storage.updateState(lvlID, 1);
  }
}
