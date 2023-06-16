export class Editor {
  public view(parent: Element = document.body): void {
    const board = document.createElement('div');
    board.classList.add('editor');

    parent.append(board);
  }
}
