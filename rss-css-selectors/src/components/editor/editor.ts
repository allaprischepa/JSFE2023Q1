import { basicSetup, EditorView } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { EditorState } from '@codemirror/state';
import { EditorThemeType, EditorType } from '../../types/types';

export class Editor {
  private editor: Element;
  private cssEditor: EditorView;
  private htmlEditor: EditorView;
  private input: HTMLInputElement;
  private btn: Element;

  constructor() {
    this.editor = document.createElement('div');
    this.editor.classList.add('editor');

    this.input = this.createInput();
    this.btn = this.createBtn();

    this.cssEditor = this.initEditor('css');
    this.htmlEditor = this.initEditor('html');
  }

  public view(parent: Element = document.body): void {
    parent.append(this.editor);
  }

  private initEditor(type: EditorType): EditorView {
    const theme = this.getEditorTheme(type);
    const editorWrapper = document.createElement('div');
    editorWrapper.classList.add(`${type}-editor`);

    const editorHeader = document.createElement('div');
    editorHeader.classList.add('editor-header');

    const panelName = document.createElement('span');
    panelName.textContent = type === 'css' ? 'CSS Editor' : 'HTML Viewer';

    const fileName = document.createElement('span');
    fileName.classList.add('file-name');
    fileName.textContent = type === 'css' ? 'style.css' : 'table.html';

    editorHeader.append(panelName, fileName);
    editorWrapper.append(editorHeader);

    const editorArea = document.createElement('div');
    editorArea.classList.add('editor-area', `theme-${theme}`);
    editorWrapper.append(editorArea);

    this.editor.append(editorWrapper);

    return this.initEditorView(type, editorArea);
  }

  private initEditorView(type: EditorType, editorArea: Element): EditorView {
    let editor: EditorView;

    if (type === 'css') {
      const text = ['', '{', '\t/* Styles will be here */', '}'];

      editor = new EditorView({
        doc: text.join('\n'),
        extensions: [basicSetup, EditorView.editable.of(false)],
        parent: editorArea,
      });

      const input = this.createCustomInputWrapper();
      editor.dom.prepend(input);
    } else {
      editor = new EditorView({
        state: EditorState.create({
          doc: '<div class="empty"></div>',
          extensions: [basicSetup, html(), EditorView.editable.of(false), EditorView.darkTheme.of(true)],
        }),
        parent: editorArea,
      });
    }

    this.updateToMinNumberOfLines(editor);

    return editor;
  }

  private getEditorTheme(type: EditorType): EditorThemeType {
    return type === 'css' ? 'light' : 'dark';
  }

  private updateToMinNumberOfLines(editor: EditorView, minNumOfLines = 20): void {
    const currentNumOfLines = editor.state.doc.lines;
    const currentStr = editor.state.doc.toString();

    if (currentNumOfLines >= minNumOfLines) return;

    const lines = minNumOfLines - currentNumOfLines;
    const appendLines = '\n'.repeat(lines);
    editor.dispatch({
      changes: { from: currentStr.length, insert: appendLines },
    });
  }

  private createInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.classList.add('task-input', 'blink');
    input.type = 'text';
    input.placeholder = 'Type in a CSS Selector';

    return input;
  }

  private createBtn(): Element {
    const btn = document.createElement('button');
    btn.classList.add('task-input-btn');
    btn.textContent = 'enter';

    return btn;
  }

  private createCustomInputWrapper(): Element {
    const wrapper = document.createElement('div');
    wrapper.classList.add('task-input-wrapper');

    wrapper.append(this.input);
    wrapper.append(this.btn);

    return wrapper;
  }

  public getEditorWrapperElement(): Element {
    return this.editor;
  }

  public getCssEditor(): EditorView {
    return this.cssEditor;
  }

  public getHtmlEditor(): EditorView {
    return this.htmlEditor;
  }

  public getInput(): HTMLInputElement {
    return this.input;
  }

  public getInputButton(): Element {
    return this.btn;
  }
}
