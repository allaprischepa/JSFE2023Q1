import { ILevel } from '../../../../types/types';

export const data: Omit<ILevel, 'htmlMarkup'> = {
  taskHeader: 'Select all on the table',
  selector: '*',
  title: 'Universal selector',
  subtitle: 'Select all elements',
  syntax: '*',
  help: 'The CSS universal selector <strong>*</strong> matches elements of any type.',
  examples: ['<strong>*</strong> will match all the elements of the document'],
};
