import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select all bananas and avocados',
  selector: 'avocado, bananas',
  syntax: 'A, B',
  title: 'Selector list',
  subtitle: `Selects all elements matching the list`,
  help: 'The <strong>,</strong> selector is a grouping method that selects all the matching nodes.',
  examples: ['<strong>div, span</strong> will match both <tag>span</tag> and <tag>div</tag> elements.'],
};
