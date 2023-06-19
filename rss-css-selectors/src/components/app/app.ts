import { Game } from '../game/game';
import { Page } from '../page/page';

export class App {
  private page;
  private game;

  constructor() {
    this.page = new Page();
    this.game = new Game(this.page);
  }

  public start(): void {
    this.page.init();
    this.game.play();
  }
}
