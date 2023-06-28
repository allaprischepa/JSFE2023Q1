export type EditorType = 'css' | 'html';

export type EditorThemeType = 'light' | 'dark';

export interface ILevel {
  taskHeader: string;
  selector: string;
  title: string;
  subtitle: string;
  syntax: string;
  help: string;
  examples: string[];
  htmlMarkup: string;
}

export enum Selectors {
  highlight = 'highlight',
  tremble = 'tremble',
  levelItem = 'level__item',
  resetProgress = 'reset-progress',
  editorLine = 'cm-line',
  passed = 'passed',
}

export interface ILevelState {
  key: string;
  passed: 0 | 1;
}

export enum Events {
  loadlevel = 'loadlevel',
  resetProgress = 'resetprogress',
}
