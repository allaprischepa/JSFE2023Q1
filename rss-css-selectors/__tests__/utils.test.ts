import { getClassSelector, addClosingTag, getStructuredHtml } from '../src/utils/utils';

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
