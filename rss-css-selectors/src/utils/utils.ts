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
    if (tagName === selector) {
      return `<${tagName} class="${className}">`;
    }

    return match;
  });
}

export function getStructuredHtml(minifiedHtml: string): string {
  let indentLevel = -1;
  const tagStack: string[] = [];
  const resStack: string[] = [];

  const tagPattern = /<(\w+)(\s[^>]+)?[^>]*>|<\/(\w+)\s*>/gi;

  let matches;
  while ((matches = tagPattern.exec(minifiedHtml)) !== null) {
    const openingTag = matches[1];
    const attributes = matches[2];
    const closingTag = matches[3];
    const previousUnclosedTag = tagStack[tagStack.length - 1];

    if (openingTag) {
      if (openingTag !== previousUnclosedTag) indentLevel += 1;
      const indent = '\t'.repeat(indentLevel);

      tagStack.push(openingTag);
      resStack.push(`${indent}<${openingTag}${attributes ? attributes : ''}>`);
    }

    if (closingTag) {
      const lastSavedString = resStack[resStack.length - 1].trim();
      const matches = lastSavedString.match(/<(\w+)(?:\s[^>]+)?[^>]*>/);
      const lastSavedTag = matches ? matches[1] : undefined;

      if (lastSavedTag === closingTag) {
        resStack[resStack.length - 1] += `</${closingTag}>`;
      } else {
        const indent = '\t'.repeat(indentLevel);
        resStack.push(`${indent}</${closingTag}>`);
      }

      indentLevel -= 1;

      if (closingTag === previousUnclosedTag) {
        tagStack.pop();
      }
    }
  }

  return resStack.join('\n');
}

export function findOpeningClosinTags(str: string): (string | null)[] {
  const tagPattern = /(?:(?:[^<]+)?<(\w+)([^>]*?)>)?(?:<\/(\w+)>)?/gi;
  let matches;
  let openingTag;
  let closingTag;

  if ((matches = tagPattern.exec(str)) !== null) {
    openingTag = matches[1];
    closingTag = matches[3];
  }

  return [openingTag ? openingTag : null, closingTag ? closingTag : null];
}

export function getChildElementByTagNumber(parent: Element, tag: string, number = 0): Element | null {
  const children = parent.getElementsByTagName(tag);

  return children && children[number] ? children[number] : null;
}
