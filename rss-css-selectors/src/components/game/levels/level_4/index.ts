import { ILevel } from '../../../../types/types';
import { data } from './level';
import { default as markup } from './markup.html';

export const level: ILevel = { ...data, htmlMarkup: markup };
