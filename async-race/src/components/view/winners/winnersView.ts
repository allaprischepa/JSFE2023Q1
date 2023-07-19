import { IWinnerCar } from '../../../types/types';
import CarItem from '../car/carItem';
import View from '../view';

export default class WinnersView extends View {
  constructor() {
    super('winners');
  }

  public getViewContent(): Element {
    const content = document.createElement('div');
    content.classList.add(`${this.type}-content`);

    const table = this.getTable();

    content.append(table);

    return content;
  }

  private getTable(): Element {
    const table = document.createElement('table');
    table.classList.add('table-winners');

    const winners = this.client.getWinners();
    winners.then((data: IWinnerCar[]) => WinnersView.addTableItems(data, table));

    return table;
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
}
