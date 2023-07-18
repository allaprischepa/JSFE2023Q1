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
    const control = this.getControlElement();

    content.append(control, table);

    return content;
  }

  private getTable(): Element {
    const table = document.createElement('div');
    table.classList.add('table-garage');

    const result = this.client.getCars();
    result.then((data) => {
      if (data) {
        console.log(data.total);
        GarageView.addTracksWithCar(data.cars, table);
      }
    });

    return table;
  }

  static addTracksWithCar(cars: ICar[], parent: Element): void {
    if (cars.length) {
      cars.forEach((carData) => {
        const tableItem = document.createElement('div');
        tableItem.classList.add('table_item');

        const name = document.createElement('div');
        name.innerText = carData.name;

        const removeBtn = document.createElement('button');
        removeBtn.addEventListener('click', () => { console.log('remove'); });

        const editBtn = document.createElement('button');
        editBtn.addEventListener('click', () => { console.log('edit'); });

        const carElement = CarItem.getCarElement(carData);
        const track = document.createElement('div');
        track.classList.add('track');

        track.append(carElement);

        tableItem.append(name, editBtn, removeBtn, track);
        parent.append(tableItem);
      });
    }
  }

  private getControlElement(): Element {
    const control = document.createElement('div');
    control.classList.add('control');

    const createCar = this.getCreateCarElement();
    const generateCars = this.getGenerateCarsElement();
    const raceControls = GarageView.getRaceControlsElement();

    control.append(createCar, generateCars, raceControls);

    return control;
  }

  private getCreateCarElement(): Element {
    const createCar = document.createElement('div');

    const form = document.createElement('form');

    const carName = document.createElement('input');
    carName.setAttribute('type', 'text');
    carName.setAttribute('required', 'required');
    carName.setAttribute('placeholder', 'Name');

    const carColor = document.createElement('input');
    carColor.setAttribute('type', 'color');
    carColor.setAttribute('required', 'required');

    const button = document.createElement('input');
    button.classList.add('create-car');
    button.setAttribute('type', 'submit');
    button.setAttribute('value', 'Create');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.client.createCar(carName.value, carColor.value);
      console.log('clicked');
    });

    form.append(carName, carColor, button);
    createCar.append(form);

    return createCar;
  }

  private getGenerateCarsElement(): Element {
    const generateCars = document.createElement('div');

    const button = document.createElement('button');
    button.classList.add('generate-cars');
    button.innerText = 'Generate cars';

    button.addEventListener('click', () => this.client.generateCars());

    generateCars.append(button);

    return generateCars;
  }

  static getRaceControlsElement(): Element {
    const raceControls = document.createElement('div');

    const buttonStart = document.createElement('button');
    buttonStart.classList.add('race-start');
    buttonStart.innerText = 'Start race';

    const buttonReset = document.createElement('button');
    buttonReset.classList.add('race-reset');
    buttonReset.innerText = 'Reset';

    raceControls.append(buttonStart, buttonReset);

    return raceControls;
  }
}
