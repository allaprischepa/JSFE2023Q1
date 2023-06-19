import { ILevel } from '../../types/types';
import { Description } from '../description/description';
import { GameBoard } from '../gameboard/gameboard';
import { Page } from '../page/page';
import { levels } from './levels';

export class LevelLoader {
  private gameboard: GameBoard;
  private description: Description;

  constructor(page: Page) {
    this.gameboard = page.getGameboard();
    this.description = page.getDescription();
  }

  public setLevel(level: number): void {
    const data = levels[level];

    this.setTaskHeader(data);
    this.setDescription(data, level);
  }

  private setTaskHeader(data: ILevel): void {
    const header = this.gameboard.getHeader();
    header.textContent = data.taskHeader;
  }

  private setDescription(data: ILevel, level: number): void {
    this.setHeader(level);
    this.setTitle(data);
    this.setSubtitle(data);
    this.setSyntax(data);
    this.setHelp(data);
    this.setExamples(data);
  }

  private setHeader(level: number): void {
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
      const exampleWrapper = document.createElement('div');
      exampleWrapper.classList.add('example');
      exampleWrapper.innerHTML = example;
      eContainer.append(exampleWrapper);
    });
  }
}
