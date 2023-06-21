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
}
