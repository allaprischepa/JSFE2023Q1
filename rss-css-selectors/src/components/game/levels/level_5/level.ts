import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select all plates that are NOT green',
  selector: 'plate:not(.green)',
  syntax: ':not(A)',
  title: 'Negation Pseudo-class',
  subtitle: `Select all elements that don't match the negation selector`,
  help:
    'The <strong>:not(A)</strong> pseudo-class represents elements that do not match an <strong>A</strong> selector.',
  examples: ['<strong>:not(.fruit)</strong> selects all elements without <strong>class="fruit"</strong>.'],
};
