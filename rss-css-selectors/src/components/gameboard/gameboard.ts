export class GameBoard {
  private board: Element;
  private header: Element;
  private table: Element;

  constructor() {
    const board = document.createElement('div');
    board.classList.add('gameboard');

    const header = document.createElement('h2');
    header.classList.add('task__header');

    const table = document.createElement('div');
    table.classList.add('table');

    this.board = board;
    this.header = header;
    this.table = table;
  }

  public view(parent: Element = document.body): void {
    this.viewHeader();
    this.viewTable();

    parent.append(this.board);
  }

  private viewHeader(): void {
    this.board.append(this.header);
  }

  private viewTable(): void {
    const wrapper = document.createElement('div');
    wrapper.classList.add('game-wrapper');

    const edge = document.createElement('div');
    edge.classList.add('table__edge');

    ['left', 'right'].forEach((side) => {
      const leg = document.createElement('div');
      leg.classList.add(`table__leg_${side}`);
      edge.append(leg);
    });

    wrapper.append(this.table);
    wrapper.append(edge);
    this.board.append(wrapper);
  }

  public getHeader(): Element {
    return this.header;
  }

  public getTable(): Element {
    return this.table;
  }
}
