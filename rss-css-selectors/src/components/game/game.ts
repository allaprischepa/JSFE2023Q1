import { Page } from '../page/page';
import { GameStorage } from './gamestorage';
import { LevelLoader } from './levelloader';

export class Game {
  private loader: LevelLoader;
  private storage: GameStorage;

  constructor(page: Page) {
    this.loader = new LevelLoader(page);
    this.storage = new GameStorage();
  }

  public play(): void {
    const level = this.storage.getCurrentLevel();
    this.loader.setLevel(level);
  }
}
