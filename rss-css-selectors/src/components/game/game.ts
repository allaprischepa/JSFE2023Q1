import { Selectors } from '../../types/types';
import { Editor } from '../editor/editor';
import { Page } from '../page/page';
import { GameStorage } from './gamestorage';
import { LevelLoader } from './levelloader';

export class Game {
  private loader: LevelLoader;
  private storage: GameStorage;
  private editor: Editor;

  constructor(page: Page) {
    this.loader = new LevelLoader(page);
    this.storage = new GameStorage();
    this.editor = page.getEditor();
  }

  public play(): void {
    const level = this.storage.getCurrentLevel();
    this.loader.setLevel(level);
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
    console.log(`Checking the answer: ${str}`);
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
