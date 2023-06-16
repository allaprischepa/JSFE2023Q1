import { Description } from '../description/description';
import { Editor } from '../editor/editor';
import { GameBoard } from '../gameboard/gameboard';

class App {
  private gameboard;
  private editor;
  private description;

  constructor() {
    this.gameboard = new GameBoard();
    this.editor = new Editor();
    this.description = new Description();
  }

  public start(): void {
    this.gameboard.view();
    this.editor.view();
    this.description.view();
  }
}

export default App;
