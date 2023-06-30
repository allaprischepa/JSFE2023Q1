import {
  getClassSelector,
  addClosingTag,
  getStructuredHtml,
  findOpeningClosinTags,
  findCorrespondingLine,
  findLineWithParentTag,
} from '../src/utils/utils';

describe('when given a string as a classname', () => {
  it('returns css classname selector', () => {
    const result = getClassSelector('testClass');
    const expected = '.testClass';
    expect(result).toEqual(expected);
  });
});

describe('when given an html string with self-closing tags (like <tag/>)', () => {
  it('returns html with all <tag/> replaced with <tag></tag>', () => {
    const arr = [
      {
        init: '<something/><div class="testClass"></div>',
        expected: '<something></something><div class="testClass"></div>',
      },
      {
        init: '<something/><div class="testClass"/>',
        expected: '<something></something><div class="testClass"></div>',
      },
      {
        init: '',
        expected: '',
      },
    ];

    arr.forEach((obj) => {
      const result = addClosingTag(obj.init);
      expect(result).toEqual(obj.expected);
    });
  });
});

describe('when given html string', () => {
  it('returns html splited into lines with indents', () => {
    const arr = [
      {
        init: `<div class="wrapper"><div id="first"></div><div id="second"></div></div>`,
        expected: `<div class="wrapper">\n\t<div id="first"></div>\n\t<div id="second"></div>\n</div>`,
      },
      {
        init: `<div class="wrapper"><span id="first"></span><span id="second"></span></div>`,
        expected: `<div class="wrapper">\n\t<span id="first"></span>\n\t<span id="second"></span>\n</div>`,
      },
    ];

    arr.forEach((obj) => {
      const result = getStructuredHtml(obj.init);
      expect(result).toEqual(obj.expected);
    });
  });
});

describe('when given html string', () => {
  it('returns array with opening and closing tags', () => {
    const arr = [
      {
        init: '<div class="wrapper"></div>',
        expected: ['div', 'div'],
      },
      {
        init: '<victory></victory>',
        expected: ['victory', 'victory'],
      },
      {
        init: '',
        expected: [null, null],
      },
      {
        init: '<div class="wrapper">',
        expected: ['div', null],
      },
      {
        init: '</div>',
        expected: [null, 'div'],
      },
    ];

    arr.forEach((obj) => {
      const result = findOpeningClosinTags(obj.init);
      expect(result).toEqual(obj.expected);
    });
  });
});

describe(`when given html text, element's tag and given index of element`, () => {
  it(`returns the number of line where searched element's tag is`, () => {
    const html = `<div class="wrapper">
    <div class="first"></div>
    <kid></kid>
    <kid></kid>
    <kid></kid>
    </div>`;

    const result1 = findCorrespondingLine(html, 'kid', 2);
    const expected1 = 4;

    const result2 = findCorrespondingLine(html, 'kid', 8);
    const expected2 = -1;

    const result3 = findCorrespondingLine(html, 'div', 1);
    const expected3 = 1;

    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe('when given html text, tag, start line and variable defining is the tag opening or not', () => {
  it('returns line number contains parent tag (closing or opening)', () => {
    // numbering starts from 1.
    const html = `<div class="wrapper">
      <div class="1">
        <div class="1.1"></div>
        <div class="1.2"></div>
      </div>
      <div class="2"></div>
      <div class="3"></div>
      <div class="4">
        <div class="4.1"></div>
        <div class="4.2"></div>
      </div>
    </div>`;

    const result1 = findLineWithParentTag('div', html, 3, false);
    const expected1 = 5;

    const result2 = findLineWithParentTag('div', html, 10);
    const expected2 = 8;

    const result3 = findLineWithParentTag('span', html, 1);
    const expected3 = -1;

    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});
