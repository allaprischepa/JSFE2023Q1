import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Please, give Ann her watermelon :)',
  selector: 'plate[for="Ann"] watermelon',
  syntax: 'A B',
  title: 'Descendant combinator',
  subtitle: `Selects an element inside another element`,
  help:
    'The <strong>A B</strong> combinator selects nodes <strong>B</strong> that are descendants of the first element <strong>A</strong>.',
  examples: [
    '<strong>div span</strong> will match all <tag>span</tag> elements that are inside a <tag>div</tag> element.',
  ],
};
