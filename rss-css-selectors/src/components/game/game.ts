import { Selectors } from '../../types/types';
import { Editor } from '../editor/editor';
import { Page } from '../page/page';
import { GameStorage } from './gamestorage';
import { LevelLoader } from './levelloader';
import { levels } from './levels';

export class Game {
  private loader: LevelLoader;
  private storage: GameStorage;
  private editor: Editor;
  private level: number;

  constructor(page: Page) {
    this.loader = new LevelLoader(page);
    this.storage = new GameStorage();
    this.editor = page.getEditor();
    this.level = this.storage.getCurrentLevel();
  }

  public play(): void {
    this.loader.setLevel(this.level);
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

  private checkAnswer(str: string): void {
    const data = levels[this.level];
    const rightAnswer = data.selector;

    if (str === rightAnswer) {
      console.log('Next level...');
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
}
