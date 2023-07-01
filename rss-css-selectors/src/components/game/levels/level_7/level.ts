import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select all berries',
  selector: '[type="berry"]',
  syntax: '[attr=value]',
  title: 'Attribute Value selector',
  subtitle: `Selects element with the given attribute`,
  help:
    '<strong>[attr=value]</strong> selects elements with an attribute name of <strong>attr</strong> whose value is exactly <strong>value</strong>.',
  examples: ['<strong>[lang="en"]</strong> will match the element that has <strong>lang="en"</strong> attribute'],
};
