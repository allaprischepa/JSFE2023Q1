import { ILevel } from '../../types/types';

export const levels: ILevel[] = [
  {
    taskHeader: 'Select the plates',
    selector: 'plate',
    title: 'Select elements by their type',
    subtitle: 'Type Selector',
    syntax: 'A',
    help:
      'Selects all elements of type <strong>A</strong>. Type refers to the type of tag, so <tag>div</tag>, <tag>p</tag> and <tag>ul</tag> are all different element types.',
    examples: [
      '<strong>div</strong> selects all <tag>div</tag> elements.',
      '<strong>p</strong> selects all <tag>p</tag> elements.',
    ],
    htmlMarkup: `
    <plate/>
    <plate/>
    `,
  },
];
