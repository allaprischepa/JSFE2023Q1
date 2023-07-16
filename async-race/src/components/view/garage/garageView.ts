import { ICar } from '../../../types/types';
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

    const response = this.client.getData();
    response
      .then((res) => res.json())
      .then((data: ICar[]) => {
        data.forEach((carData) => {
          const carElement = GarageView.getCarElement(carData);
          table.append(carElement);
        });
      });

    return table;
  }

  static getCarElement(carData: ICar): Element {
    const car = document.createElement('div');
    car.classList.add('car');
    car.id = `${carData.id}`;
    car.setAttribute('data-color', carData.color);

    const carImage = document.createElement('div');
    carImage.classList.add('car_image');
    carImage.style.backgroundColor = carData.color;

    car.append(carImage);

    return car;
  }
}
