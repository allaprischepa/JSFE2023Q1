import { ICar } from '../../../types/types';
import brands from './brands';

export default class CarItem {
  static getCarElement(carData: ICar): Element {
    const car = document.createElement('div');
    car.classList.add('car');

    const carImage = CarItem.getCarImage(carData.color);

    car.append(carImage);

    return car;
  }

  static getCarImage(color: string) {
    const carImage = document.createElement('div');
    carImage.classList.add('car_image');
    carImage.style.backgroundColor = color;

    return carImage;
  }

  static generateRandomName(): string {
    const indexB = Math.floor(Math.random() * brands.length);
    const { brand, models } = brands[indexB];
    const indexM = Math.floor(Math.random() * models.length);
    const model = models[indexM];

    return `${brand} ${model}`;
  }

  static generateRandomColor(): string {
    // 16777215 is FFFFFF in hexadecimal system.
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    return `#${randomColor}`;
  }
}
