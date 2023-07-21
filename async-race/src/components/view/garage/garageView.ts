import { Attributes, ICar } from '../../../types/types';
import { createElement } from '../../../utils/utils';
import CarItem from '../car/carItem';
import View from '../view';

export default class GarageView extends View {
  public table: Element;

  public pageLimit = 7;

  public page: number;

  constructor() {
    super('garage');

    this.page = 1;
    this.table = this.getTable();
  }

  public getViewContent(): Element {
    const content = createElement('div', [`${this.type}-content`]);

    this.fillTable(this.page);
    const control = this.getControlElement();

    content.append(control, this.table);

    return content;
  }

  public fillTableContent(page: number, tableInfo: Element, tableItems: Element): void {
    const result = this.client.getCars(page, this.pageLimit);
    result.then((data) => {
      if (data) {
        this.addTableInfo(data.total, tableInfo);
        this.addTracksWithCar(data.cars, tableItems);
      }
    });
  }

  public updateTableContent(page: number, tableInfo: Element, tableItems: Element): void {
    const result = this.client.getCars(page, this.pageLimit);
    result.then((data) => {
      if (data) {
        this.updateTableInfo(data.total, tableInfo);
        this.updateTableItems(data.cars, tableItems);
      }
    });
  }

  private updateTableItems(cars: ICar[], parent: Element): void {
    const tableItemsElement = parent;

    if (cars.length) {
      const ids = cars.map((carData) => carData.id);
      GarageView.removeItemsNotInList(ids, tableItemsElement);
      this.addNewItems(cars, tableItemsElement);
    } else {
      tableItemsElement.innerHTML = '';
    }
  }

  static removeItemsNotInList(ids: number[], parent: Element): void {
    const tableItems = parent.querySelectorAll('.table_item');

    if (tableItems.length) {
      tableItems.forEach((tableItem) => {
        const itemID = tableItem.getAttribute('data-id');
        if (!ids.includes(+itemID)) tableItem.remove();
      });
    }
  }

  private addNewItems(cars: ICar[], parent: Element): void {
    if (cars.length) {
      cars.forEach((carData) => {
        const selector = `.table_item[data-id="${carData.id}"]`;
        const tableItem = parent.querySelector(selector);

        if (!tableItem) this.addSingleTrackWithCar(carData, parent);
      });
    }
  }

  private addTracksWithCar(cars: ICar[], parent: Element): void {
    if (cars.length) {
      cars.forEach((carData) => this.addSingleTrackWithCar(carData, parent));
    }
  }

  private addSingleTrackWithCar(carData: ICar, parent: Element): void {
    const tableItem = createElement('div', ['table_item'], { 'data-id': `${carData.id}` });
    const carInfo = createElement('div', ['car-info']);
    const name = createElement('div', ['car_name']);
    const removeBtn = this.getRemoveCarButton(carData);
    const editBtn = this.getEditCarButton(carData);
    const carElement = CarItem.getCarElement(carData);
    const track = createElement('div', ['track']);

    name.innerText = carData.name;

    carInfo.append(editBtn, removeBtn, name);
    track.append(carElement);

    tableItem.append(carInfo, track);
    parent.append(tableItem);
  }

  private getControlElement(): Element {
    const control = createElement('div', ['control']);

    const createCar = this.getCreateCarElement();
    const generateCars = this.getGenerateCarsElement();
    const raceControls = GarageView.getRaceControlsElement();

    control.append(createCar, generateCars, raceControls);

    return control;
  }

  private getCreateCarElement(): Element {
    const carNamesAttrs: Attributes = {
      type: 'text',
      required: 'required',
      placeholder: 'Name',
    };
    const carColorAttributes: Attributes = {
      type: 'color',
      required: 'required',
    };
    const buttonAttributes: Attributes = {
      type: 'submit',
      value: 'Create',
    };

    const createCar = createElement('div');
    const form = createElement('form', ['create-car-form']);
    const carName = createElement('input', [], carNamesAttrs);
    const carColor = createElement('input', ['input-type-color'], carColorAttributes);
    const button = createElement('input', ['button', 'create-car'], buttonAttributes);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (carName instanceof HTMLInputElement && carColor instanceof HTMLInputElement) {
        const result = this.client.createCar(carName.value, carColor.value);
        result.then(() => this.updateTable(this.page));
      }
    });

    form.append(carName, carColor, button);
    createCar.append(form);

    return createCar;
  }

  private getGenerateCarsElement(): Element {
    const generateCars = createElement('div');
    const button = createElement('button', ['button', 'generate-cars']);
    button.innerText = 'Generate cars';

    button.addEventListener('click', () => {
      const result = this.client.generateCars();
      result.then(() => this.updateTable(this.page));
    });

    generateCars.append(button);

    return generateCars;
  }

  static getRaceControlsElement(): Element {
    const raceControls = createElement('div', ['race-controls']);
    const buttonStart = createElement('button', ['button', 'race-start']);
    const buttonReset = createElement('button', ['button', 'race-reset']);

    buttonStart.innerText = 'Start race';
    buttonReset.innerText = 'Reset';

    raceControls.append(buttonStart, buttonReset);

    return raceControls;
  }

  private getRemoveCarButton(carData: ICar): Element {
    const btnWrapper = createElement('div', ['car_remove-container']);
    const removeBtn = createElement('button', ['button', 'car_remove']);

    removeBtn.addEventListener('click', () => {
      const res = this.client.removeCar(carData.id);
      res.then(() => {
        this.updateTable(this.page);
        GarageView.generateUpdateWinnersEvent();
      });
    });

    btnWrapper.append(removeBtn);

    return btnWrapper;
  }

  private getEditCarButton(carData: ICar): Element {
    const btnWrapper = createElement('div', ['car_edit-container']);
    const editBtn = createElement('button', ['button', 'car_edit']);
    const form = this.getEditCarForm(carData);

    editBtn.addEventListener('click', () => {
      form.classList.toggle('show');
      if (form instanceof HTMLFormElement) form.reset();
    });

    btnWrapper.append(form, editBtn);

    return btnWrapper;
  }

  private getEditCarForm(carData: ICar): Element {
    const form = createElement('form', ['edit-car-form']);
    const carName = createElement('input', [], { type: 'text', required: 'required' });
    const carColor = createElement('input', ['input-type-color'], { type: 'color', required: 'required' });
    const submit = createElement('input', ['button'], { type: 'submit', value: 'ok' });

    if (carName instanceof HTMLInputElement) carName.defaultValue = carData.name;
    if (carColor instanceof HTMLInputElement) carColor.defaultValue = carData.color;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.classList.remove('show');

      if (carName instanceof HTMLInputElement && carColor instanceof HTMLInputElement) {
        const result = this.client.updateCar(carData.id, carName.value, carColor.value);

        result.then((carDataUpdated: ICar) => {
          carName.defaultValue = carName.value;
          carColor.defaultValue = carColor.value;

          this.updateTableItem(carDataUpdated);
          GarageView.generateUpdateWinnersEvent();
        });
      }
    });

    form.append(carName, carColor, submit);

    return form;
  }

  private updateTableItem(carData: ICar): void {
    const selector = `.table_item[data-id="${carData.id}"]`;
    const tableItem = this.table.querySelector(selector);

    if (tableItem) {
      const name = tableItem.querySelector('.car_name');
      const carImage = tableItem.querySelector('.car_image');

      if (name instanceof HTMLElement) name.innerText = carData.name;
      carImage.replaceWith(CarItem.getCarImage(carData.color));
    }
  }

  static generateUpdateWinnersEvent(): void {
    document.dispatchEvent(new Event('updateWinners'));
  }
}
