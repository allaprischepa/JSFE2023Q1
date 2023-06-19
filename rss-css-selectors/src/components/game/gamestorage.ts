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

  public getFromStorage(name: string): string | null {
    return localStorage.getItem(`${this.storagePrefix}${name}`);
  }

  public setToStorage(name: string, def: string): void {
    localStorage.setItem(`${this.storagePrefix}${name}`, def);
  }
}
