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
