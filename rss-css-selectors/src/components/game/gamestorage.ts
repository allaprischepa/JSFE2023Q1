import { ILevel, ILevelState } from '../../types/types';

export class GameStorage {
  private storagePrefix = 'aprcs_';

  public getCurrentLevel(): number {
    let level = this.getFromStorage('currentLevel');

    if (!level) {
      level = `0`;
      this.setToStorage('currentLevel', level);
    }

    return +level;
  }

  public setCurrentLevel(lvl: number): void {
    this.setToStorage('currentLevel', `${lvl}`);
  }

  public getFromStorage(name: string): string | null {
    return localStorage.getItem(`${this.storagePrefix}${name}`);
  }

  public setToStorage(name: string, def: string): void {
    localStorage.setItem(`${this.storagePrefix}${name}`, def);
  }

  public getState(levels: ILevel[]): ILevelState[] {
    const data = this.getFromStorage('state');

    if (data) return JSON.parse(data);

    const state: ILevelState[] = [];

    if (levels) {
      levels.forEach((lvl) => {
        const lvlState: ILevelState = {
          key: `${lvl.selector}${lvl.htmlMarkup}`,
          passed: 0,
        };
        state.push(lvlState);
      });
      this.setToStorage('state', JSON.stringify(state));
    }

    return state;
  }

  public updateState(lvlID: string, passed: 0 | 1): void {
    const data = this.getFromStorage('state');

    if (data) {
      const state: ILevelState[] = JSON.parse(data);
      const index = state.findIndex((obj) => obj.key === lvlID);

      if (index >= 0) {
        state[index]['passed'] = passed;
        this.setToStorage('state', JSON.stringify(state));
      }
    }
  }

  public clear(): void {
    ['state', 'currentLevel'].forEach((str) => {
      this.removeFromStorage(str);
    });
  }

  public removeFromStorage(name: string): void {
    localStorage.removeItem(`${this.storagePrefix}${name}`);
  }
}
