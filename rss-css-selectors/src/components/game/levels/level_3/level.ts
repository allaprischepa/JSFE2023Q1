import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select the green plate',
  selector: '.green',
  title: 'Class Selector',
  subtitle: 'Select elements by their class',
  syntax: '.A',
  help: 'Selects all elements that have the given class attribute <strong>class="A"</strong>.',
  examples: [
    '<strong>.index</strong> will match any element that has <strong>class="index"</strong>',
    '<strong>.fruit</strong> will match any element that has <strong>class="fruit"</strong>',
  ],
};
