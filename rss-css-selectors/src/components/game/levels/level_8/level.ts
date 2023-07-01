import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select all bananas right after avocado',
  selector: 'avocado + bananas',
  syntax: 'A + B',
  title: 'Adjacent sibling combinator',
  subtitle: `Selects second element when it immediately follows the first element`,
  help:
    'The <strong>+</strong> combinator matches the second element <strong>B</strong> only if it immediately follows the first element <strong>A</strong>.',
  examples: [
    '<strong>h2 + p</strong> will match the first <tag>p</tag> element that immediately follows an <tag>h2</tag> element.',
  ],
};
