import { ILevel } from '../../types/types';
import { Description } from '../description/description';
import { GameBoard } from '../gameboard/gameboard';
import { Page } from '../page/page';
import { levels } from './levels';

export class Game {
  private gameboard: GameBoard;
  private description: Description;
  private storagePrefix = 'aprcs_';

  constructor(page: Page) {
    this.gameboard = page.getGameboard();
    this.description = page.getDescription();
  }

  public play(): void {
    const level = this.getCurrentLevel();
    const data = levels[level];

    this.setTaskHeader(data);
    this.setDescription(data, level);
  }

  private getCurrentLevel(def = 0): number {
    let level = this.getFromStorage('currentLevel');

    if (!level) {
      level = `${def}`;
      this.setToStorage('currentLevel', level);
    }

    return +level;
  }

  private getFromStorage(name: string): string | null {
    return localStorage.getItem(name);
  }

  private setToStorage(name: string, def: string): void {
    localStorage.setItem(name, def);
  }

  private setTaskHeader(data: ILevel): void {
    const header = this.gameboard.getHeader();
    header.textContent = data.taskHeader;
  }

  private setDescription(data: ILevel, level: number): void {
    this.setHeader(data, level);
    this.setTitle(data);
    this.setSubtitle(data);
    this.setSyntax(data);
    this.setHelp(data);
    this.setExamples(data);
  }

  private setHeader(data: ILevel, level: number): void {
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
      eContainer.innerHTML += example;
    });
  }
}
