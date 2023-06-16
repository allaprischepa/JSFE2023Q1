export class Description {
  public view(): void {
    const body = document.body;
    const board = document.createElement('div');
    board.classList.add('description');

    body.append(board);
  }
}
