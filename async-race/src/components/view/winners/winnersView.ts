import { IWinnerCar } from '../../../types/types';
import CarItem from '../car/carItem';
import View from '../view';

export default class WinnersView extends View {
  private table: HTMLTableElement;

  private pageLimit = 10;

  private page: number;

  constructor() {
    super('winners');

    this.page = 1;
    this.table = WinnersView.getTable();
  }

  public getViewContent(): Element {
    const content = document.createElement('div');
    content.classList.add(`${this.type}-content`);

    this.fillTable(this.page);
    content.append(this.table);

    WinnersView.listenUpdateEvent();

    return content;
  }

  static getTable(): HTMLTableElement {
    const table = document.createElement('table');
    table.classList.add('table-winners');

    return table;
  }

  private fillTable(page: number): void {
    const result = this.client.getWinners(page, this.pageLimit);
    result.then((data) => {
      if (data) {
        console.log(data.total);
        WinnersView.addTableItems(data.cars, this.table);
      }
    });
  }

  static addTableItems(carItems: IWinnerCar[], table: HTMLTableElement): void {
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();
    const tableHeadRow = tableHead.insertRow();
    tableHead.classList.add('table_head');
    const rows = {
      num: '№',
      image: 'Image',
      name: 'Name',
      wins: 'Wins',
      time: 'Best time (sec)',
    };

    Object.values(rows).forEach((val) => {
      const elem = tableHeadRow.insertCell();
      elem.innerText = val;
    });

    if (carItems.length) {
      carItems.forEach((carItem: IWinnerCar) => {
        const tableRow = tableBody.insertRow();
        tableRow.classList.add('table_row');

        Object.keys(rows).forEach((key) => {
          const elem = tableRow.insertCell();
          elem.classList.add(`${key}`);

          switch (key) {
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

  static listenUpdateEvent() {
    document.addEventListener('updateWinners', () => { console.log('update winners'); });
  }
}
