/**
 * @jest-environment jsdom
 */
import { addAttributeWithElementHtml, addClassToSelector } from '../src/utils/utils';

describe('when given html string', () => {
  it(`returns html where every tag contains data-tooltip attribute
  with self data (like <tag class="class" id ="id"</tag>)`, () => {
    const init = `<water class="warm" id="deepwater"></water>`;
    const replacement = init.replace(/"/g, '&quot;');
    const expected = `<water class="warm" id="deepwater" data-tooltip="${replacement}"></water>`;

    const result = addAttributeWithElementHtml(init);
    expect(result).toEqual(expected);
  });
});

describe('when given html string, certain tag and classname', () => {
  it('returns html where every certain tag contains class attribute with given classname', () => {
    const selector = 'water';
    const className = 'dark';
    const init = `<water class="warm" id="deepwater"></water><div id="test">someText</div>`;
    const expected = `<water class="warm dark" id="deepwater"></water><div id="test">someText</div>`;

    const result = addClassToSelector(init, selector, className);
    expect(result).toEqual(expected);
  });
});
