import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select empty plate',
  selector: 'plate:empty',
  syntax: ':empty',
  title: 'Empty Pseudo-class',
  subtitle: `Selects element with no children.`,
  help:
    'The <strong>:empty</strong> CSS pseudo-class represents any element that has no children. Children can be either element nodes or text (including whitespace)',
  examples: ['<strong>div:empty</strong> will match the <tag>div</tag> element that has no children'],
};
