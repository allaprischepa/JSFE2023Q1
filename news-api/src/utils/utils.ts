export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: HTMLElement | Document = document
): T | null {
  return parent.querySelector(selector);
}

export function retrieveClass(selector: string): string {
  return selector.replace('.', '');
}
