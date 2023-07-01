import { Game } from '../game/game';
import { Page } from '../page/page';

export class App {
  private page: Page;
  private game: Game;

  constructor() {
    [this.page, this.game] = this.init();
  }

  private init(): [Page, Game] {
    const page = new Page();
    const game = new Game(page);

    return [page, game];
  }

  public start(): void {
    this.page.view();
    this.game.play();
  }
}
