import { ICar } from '../../../types/types';

export default class CarItem {
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
