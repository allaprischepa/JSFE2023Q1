/**
 * @jest-environment jsdom
 */
import {
  addAttributeWithElementHtml,
  addClassToSelector,
  getChildElementByTagNumber,
  getIndexOfCertainElement,
  compareNodeLists,
} from '../src/utils/utils';
import { Editor } from '../src/components/editor/editor';
import { EditorView } from 'codemirror';

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

describe('when given parent element, tag and number', () => {
  it('returns n child of parent element selected by tag ', () => {
    const parent = document.createElement('div');
    const tag = 'kid';

    ['first', 'second', 'third'].forEach((className) => {
      const elem = document.createElement(tag);
      elem.classList.add(className);
      parent.append(elem);
    });

    ['first', 'second', 'third'].forEach((className, ind) => {
      const result = getChildElementByTagNumber(parent, tag, ind);
      const expected = parent.querySelector(`.${className}`);

      expect(result).toEqual(expected);
    });
  });
});

describe('when given array of elements and searched element', () => {
  it('returns index of given element in given array', () => {
    const parent = document.createElement('div');

    ['first', 'second', 'third'].forEach((className) => {
      const elem = document.createElement('div');
      elem.classList.add(className);
      parent.append(elem);
    });

    ['first', 'second', 'third'].forEach((className, ind) => {
      const target = parent.querySelector(`.${className}`);

      if (target) {
        const result = getIndexOfCertainElement(Array.from(parent.children), target);
        expect(result).toEqual(ind);
      }
    });
  });
});

describe('when given EditorView object and number of lines', () => {
  it('number of lines for given editor is updated to given number', () => {
    const editor = new Editor();

    [13, 2, 44].forEach((linesCount) => {
      const editorView = new EditorView();
      editor.updateToMinNumberOfLines(editorView, linesCount);
      const result = editorView.state.doc.lines;

      expect(result).toEqual(linesCount);
    });
  });
});

describe('when given two NodeLists', () => {
  it('returns true if they are the same, otherwise returns false', () => {
    const parent = document.createElement('div');
    parent.innerHTML = `
      <div class="earth">
        <water class="water water-inner"></water>
      </div>
      <water class="water"></water>
      <water class="water water-last"></water>
    `;

    // First compare.
    const list1 = parent.querySelectorAll('.water');
    const list2 = parent.querySelectorAll('water');
    const compare1 = compareNodeLists(list1, list2);

    // Second compare.
    const list3 = parent.querySelectorAll('.earth .water');
    const list4 = parent.querySelectorAll('.water-inner');
    const compare2 = compareNodeLists(list3, list4);

    expect(compare1).toBe(true);
    expect(compare2).toBe(true);
  });
});
