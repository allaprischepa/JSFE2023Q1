import { ILevel } from '../../../../types/types';
import { default as data } from './level.json';
import { default as markup } from './markup.html';

export const level: ILevel = Object.assign({}, data, { htmlMarkup: markup });
