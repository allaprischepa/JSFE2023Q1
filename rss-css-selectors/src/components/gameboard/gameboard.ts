export class GameBoard {
  public view(): void {
    const body = document.body;
    const board = document.createElement('div');
    board.classList.add('gameboard');

    body.append(board);
  }
}
