export function getClassSelector(val: string): string {
  return `.${val}`;
}

export function addClosingTag(str: string): string {
  return str.replace(/<([a-z]+)(\s*)?\/>/g, (match: string, tagName: string) => {
    return `<${tagName}></${tagName}>`;
  });
}

export function addAttributeWithElementHtml(str: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = str;
  const elements = tempDiv.querySelectorAll('*');

  elements.forEach((elem) => {
    const tag = elem.tagName.toLowerCase();
    const attrs: string[] = [];

    if (elem.attributes) {
      for (let i = 0; i < elem.attributes.length; i += 1) {
        const attribute = elem.attributes[i];
        attrs.push(`${attribute.name}="${attribute.value}"`);
      }
    }

    const htmlStructure = `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}><${tag}>`;

    elem.setAttribute('data-tooltip', htmlStructure);
  });

  return tempDiv.innerHTML;
}

export function addClassToSelector(str: string, selector: string, className: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = str;
  const elements = tempDiv.querySelectorAll(selector);

  elements.forEach((elem) => elem.classList.add(className));

  return tempDiv.innerHTML;
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

export function findLineWithParentTag(tag: string, text: string, startFrom: number, opening = true): number {
  const textLines = text.split('\n');
  let resLine = -1;
  const tagsStack: number[] = [];

  if (textLines) {
    if (opening) {
      for (let i = startFrom - 1; i >= 0; i -= 1) {
        const lineText = textLines[i];

        if (lineText.includes(`</${tag}`)) {
          tagsStack.push(i);
        }

        if (lineText.includes(`<${tag}`)) {
          if (tagsStack.length) {
            tagsStack.pop();
          } else {
            resLine = i + 1;
          }
        }
      }
    } else {
      for (let i = startFrom + 1; i < textLines.length; i += 1) {
        const lineText = textLines[i];

        if (lineText.includes(`<${tag}`)) {
          tagsStack.push(i);
        }

        if (lineText.includes(`</${tag}`)) {
          if (tagsStack.length) {
            tagsStack.pop();
          } else {
            resLine = i + 1;
          }
        }
      }
    }
  }

  return resLine;
}

export function getIndexOfCertainElement(arr: Element[], target: Element): number {
  let index = -1;

  arr.forEach((el, ind) => {
    if (el.isSameNode(target)) {
      index = ind;
      return;
    }
  });

  return index;
}

export function findCorrespondingLine(text: string, tagName: string, index: number): number {
  let count = -1;
  const splitedText = text.split('\n');

  for (let i = 0; i < splitedText.length; i += 1) {
    const lineText = splitedText[i];
    if (lineText.includes(`<${tagName}`)) {
      count += 1;
      if (count === index) return i;
    }
  }

  return -1;
}
