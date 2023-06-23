export function getClassSelector(val: string): string {
  return `.${val}`;
}

export function addClosingTag(str: string): string {
  return str.replace(/<([a-z]+)(\s*)?\/>/g, (match: string, tagName: string) => {
    return `<${tagName}></${tagName}>`;
  });
}

export function addClassToSelector(str: string, selector: string, className: string): string {
  return str.replace(/<([a-z]+)>/g, (match: string, tagName: string) => {
    console.log(tagName);
    if (tagName === selector) {
      return `<${tagName} class="${className}">`;
    }

    return match;
  });
}
