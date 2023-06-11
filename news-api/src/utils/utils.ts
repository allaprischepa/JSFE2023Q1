export function getElement(selector: string, parent: HTMLElement | Document = document): HTMLElement | null {
  return parent.querySelector(selector);
}

export function retrieveClass(selector: string): string {
  return selector.replace('.', '');
}
