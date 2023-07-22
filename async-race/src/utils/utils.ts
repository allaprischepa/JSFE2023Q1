import { Attributes } from '../types/types';

export function capitalize(word: string): string {
  const firstLetter = word.charAt(0).toUpperCase();
  const otherLetters = word.slice(1);

  return `${firstLetter}${otherLetters}`;
}

export function createElement(tag: string, classlist: string[] = [], attributes: Attributes = {}) {
  const element = document.createElement(tag);
  element.classList.add(...classlist);

  Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));

  return element;
}

export function toSeconds(time: number): number {
  return +(time / 1000).toFixed(3);
}
