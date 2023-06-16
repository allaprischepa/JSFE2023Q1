export class Editor {
  public view(): void {
    const body = document.body;
    const board = document.createElement('div');
    board.classList.add('editor');

    body.append(board);
  }
}
