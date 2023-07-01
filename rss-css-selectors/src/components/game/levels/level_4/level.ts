import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select bitten apple',
  selector: '#bitten',
  syntax: '#A',
  title: 'ID selector',
  subtitle: `Selects element with the ID`,
  help:
    'Selects an element based on the value of its <strong>ID</strong> attribute. There should be only one element with a given <strong>ID</strong> in a document.',
  examples: ['<strong>#toc</strong> will match the element that has <strong>id="toc"</strong>'],
};
