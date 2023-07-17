import { ICar } from '../../../types/types';
import CarItem from '../car/carItem';
import View from '../view';

export default class GarageView extends View {
  constructor() {
    super('garage');
  }

  public getViewContent(): Element {
    const content = document.createElement('div');
    content.classList.add(`${this.type}-content`);

    const table = this.getTable();

    content.append(table);

    return content;
  }

  private getTable(): Element {
    const table = document.createElement('div');
    table.classList.add('table-garage');

    const cars = this.client.getCars();
    cars.then((data: ICar[]) => GarageView.addTracksWithCar(data, table));

    return table;
  }

  static addTracksWithCar(cars: ICar[], parent: Element): void {
    if (cars.length) {
      cars.forEach((carData) => {
        const carElement = CarItem.getCarElement(carData);
        const track = document.createElement('div');
        track.classList.add('track');

        track.append(carElement);
        parent.append(track);
      });
    }
  }
}
