import { IWinnerCar } from '../../../types/types';
import { createElement } from '../../../utils/utils';
import CarItem from '../car/carItem';
import View from '../view';

export default class WinnersView extends View {
  public table: Element;

  public pageLimit = 10;

  public page: number;

  private sort = '';

  private order = '';

  private rows = {
    num: '№',
    image: 'Image',
    name: 'Name',
    wins: 'Wins',
    time: 'Best time (sec)',
  };

  constructor() {
    super('winners');

    this.page = 1;
    this.table = this.getTable();
  }

  public getViewContent(): Element {
    const content = createElement('div', [`${this.type}-content`]);

    this.fillTable(this.page);
    content.append(this.table);

    this.listenUpdateEvent();

    return content;
  }

  public fillTableContent(page: number, tableInfo: Element, tableItems: Element): void {
    const result = this.client.getWinners(page, this.pageLimit);
    result.then((data) => {
      if (data) {
        this.addTableInfo(data.total, tableInfo);
        this.addTableItems(data.cars, tableItems);
      }
    });
  }

  public updateTableContent(page: number, tableInfo: Element, tableItems: Element): void {
    const result = this.client.getWinners(page, this.pageLimit, this.sort, this.order);
    result.then((data) => {
      if (data) {
        this.updateTableInfo(data.total, tableInfo);
        this.addTableItems(data.cars, tableItems);
      }
    });
  }

  private addTableItems(carItems: IWinnerCar[], table: Element): void {
    if (!(table instanceof HTMLTableElement)) return;

    this.fillTableHead(table);
    this.fillTableBody(table, carItems);
  }

  private fillTableHead(table: HTMLTableElement): void {
    if (!table.tHead) {
      const tableHead = table.createTHead();
      const tableHeadRow = tableHead.insertRow();
      tableHead.classList.add('table_head');

      Object.entries(this.rows).forEach(([key, val]) => {
        const elem = tableHeadRow.insertCell();
        elem.classList.add('column-header', `column-${key}`);
        elem.innerHTML = `<span class="column-text">${val}</span>`;

        switch (key) {
          case 'wins':
          case 'time':
            elem.classList.add('column-sort');
            elem.addEventListener('click', () => {
              WinnersView.clearOtherSorting(tableHead, key);
              this.setSortOrder(elem);
              this.sortTableItems(key);
            });
            break;
          default:
        }
      });
    }
  }

  private fillTableBody(table: HTMLTableElement, carItems: IWinnerCar[]): void {
    const tableBody = table.tBodies.item(0) || table.createTBody();
    tableBody.innerHTML = '';

    if (carItems.length) {
      carItems.forEach((carItem: IWinnerCar, ind: number) => {
        const index = ((this.page - 1) * this.pageLimit) + ind + 1;
        const tableRow = tableBody.insertRow();
        tableRow.classList.add('table_row');

        Object.keys(this.rows).forEach((key) => {
          const elem = tableRow.insertCell();
          elem.classList.add(`${key}`);

          switch (key) {
            case 'num':
              elem.innerText = `${index}`;
              break;
            case 'image':
              elem.append(CarItem.getCarImage(carItem.color));
              break;
            case 'name':
            case 'wins':
            case 'time':
              elem.innerText = `${carItem[key]}`;
              break;
            default:
          }
          tableRow.append(elem);
        });
      });
    }
  }

  private listenUpdateEvent(): void {
    document.addEventListener('updateWinners', () => {
      this.fillTable(this.page);
    });
  }

  private setSortOrder(elem: Element): string {
    let order = elem.getAttribute('data-order');

    if (order) order = order === 'ASC' ? 'DESC' : '';
    else order = 'ASC';

    this.order = order;
    elem.setAttribute('data-order', order);

    return order;
  }

  static clearOtherSorting(tableHead: Element, key: string) {
    const columns = tableHead.querySelectorAll(`.column-header:not(.column-${key})`);

    if (columns) columns.forEach((column) => column.removeAttribute('data-order'));
  }

  private sortTableItems(sort: string) {
    const tableInfo = this.table.querySelector('.table-info');
    const tableItems = this.table.querySelector('.table-items');
    this.sort = sort;

    this.updateTableContent(this.page, tableInfo, tableItems);
  }
}
