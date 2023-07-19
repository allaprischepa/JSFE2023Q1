import { ICar } from '../../../types/types';
import CarItem from '../car/carItem';
import View from '../view';

export default class GarageView extends View {
  private table: Element;

  private pageLimit = 10;

  private page: number;

  constructor() {
    super('garage');

    this.page = 1;
    this.table = GarageView.getTable();
  }

  public getViewContent(): Element {
    const content = document.createElement('div');
    content.classList.add(`${this.type}-content`);

    this.fillTable(this.page);
    const control = this.getControlElement();

    content.append(control, this.table);

    return content;
  }

  private fillTable(page: number): void {
    const tableInfo = this.table.querySelector('.table-info');
    const tableItems = this.table.querySelector('.table-items');

    tableInfo.innerHTML = '';
    tableItems.innerHTML = '';

    const result = this.client.getCars(page);
    result.then((data) => {
      if (data) {
        this.addTableInfo(data.total, tableInfo);
        GarageView.addTracksWithCar(data.cars, tableItems);
      }
    });
  }

  private updateTable(page: number): void {
    const tableInfo = this.table.querySelector('.table-info');
    const tableItems = this.table.querySelector('.table-items');

    const result = this.client.getCars(page);
    result.then((data) => {
      if (data) {
        this.updateTableInfo(data.total, tableInfo);
        GarageView.updateTableItems(data.cars, tableItems);
      }
    });
  }

  static getTable(): Element {
    const table = document.createElement('div');
    table.classList.add('table-garage');

    const tableInfo = document.createElement('div');
    tableInfo.classList.add('table-info');

    const tableItems = document.createElement('div');
    tableItems.classList.add('table-items');

    table.append(tableInfo, tableItems);

    return table;
  }

  private addTableInfo(total: string, parent: Element): void {
    const totalAmount = document.createElement('div');
    totalAmount.classList.add('total-amount');
    totalAmount.innerHTML = `<strong>Total: </strong><span class="amount">${total}</span>`;

    const pager = this.getPager(+total);

    parent.append(totalAmount, pager);
  }

  private getPager(total: number): Element {
    const pager = document.createElement('div');
    const prev = document.createElement('div');
    const current = document.createElement('div');
    const next = document.createElement('div');

    pager.classList.add('pager');
    prev.classList.add('prev', 'pager_item');
    current.classList.add('current', 'pager_item');
    next.classList.add('next', 'pager_item');

    this.calculatePager(total, prev, current, next);

    prev.addEventListener('click', (event) => {
      event.preventDefault();

      this.page -= 1;
      this.updateTable(this.page);
    });
    next.addEventListener('click', () => {
      this.page += 1;
      this.updateTable(this.page);
    });

    pager.append(prev, current, next);

    return pager;
  }

  private calculatePager(total: number, prev: Element, current: Element, next: Element): void {
    const currentElement = current;
    const lastPage = Math.ceil(total / this.pageLimit);

    if (this.page > lastPage) this.page = lastPage;
    const currentPage = this.page;

    if (currentElement instanceof HTMLElement) currentElement.innerText = `${currentPage}`;

    prev.classList.remove('inactive');
    next.classList.remove('inactive');

    if ((currentPage - 1) <= 0) prev.classList.add('inactive');
    if ((currentPage + 1) > lastPage) next.classList.add('inactive');
  }

  private updateTableInfo(total: string, parent: Element): void {
    const amount = parent.querySelector('.amount');
    const pager = parent.querySelector('.pager');
    const prev = pager.querySelector('.prev');
    const current = pager.querySelector('.current');
    const next = pager.querySelector('.next');

    if (amount instanceof HTMLElement) amount.innerText = total;
    this.calculatePager(+total, prev, current, next);
  }

  static updateTableItems(cars: ICar[], parent: Element): void {
    const tableItemsElement = parent;

    if (cars.length) {
      const ids = cars.map((carData) => carData.id);
      GarageView.removeItemsNotInList(ids, tableItemsElement);
      GarageView.addNewItems(cars, tableItemsElement);
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

  static addNewItems(cars: ICar[], parent: Element): void {
    if (cars.length) {
      cars.forEach((carData) => {
        const selector = `.table_item[data-id="${carData.id}"]`;
        const tableItem = parent.querySelector(selector);

        if (!tableItem) GarageView.addSingleTrackWithCar(carData, parent);
      });
    }
  }

  static addTracksWithCar(cars: ICar[], parent: Element): void {
    if (cars.length) {
      cars.forEach((carData) => GarageView.addSingleTrackWithCar(carData, parent));
    }
  }

  static addSingleTrackWithCar(carData: ICar, parent: Element): void {
    const tableItem = document.createElement('div');
    tableItem.classList.add('table_item');
    tableItem.setAttribute('data-id', `${carData.id}`);

    const carInfo = document.createElement('div');
    carInfo.classList.add('car-info');

    const name = document.createElement('div');
    name.classList.add('car_name');
    name.innerText = carData.name;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('button', 'car_remove');
    removeBtn.addEventListener('click', () => { console.log('remove'); });

    const editBtn = document.createElement('button');
    editBtn.classList.add('button', 'car_edit');
    editBtn.addEventListener('click', () => { console.log('edit'); });

    const carElement = CarItem.getCarElement(carData);
    const track = document.createElement('div');
    track.classList.add('track');

    carInfo.append(name, editBtn, removeBtn);
    track.append(carElement);

    tableItem.append(carInfo, track);
    parent.append(tableItem);
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
    form.classList.add('create-car-form');

    const carName = document.createElement('input');
    carName.setAttribute('type', 'text');
    carName.setAttribute('required', 'required');
    carName.setAttribute('placeholder', 'Name');

    const carColor = document.createElement('input');
    carColor.classList.add('input-type-color');
    carColor.setAttribute('type', 'color');
    carColor.setAttribute('required', 'required');

    const button = document.createElement('input');
    button.classList.add('button', 'create-car');
    button.setAttribute('type', 'submit');
    button.setAttribute('value', 'Create');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = this.client.createCar(carName.value, carColor.value);
      result.then(() => this.updateTable(this.page));
    });

    form.append(carName, carColor, button);
    createCar.append(form);

    return createCar;
  }

  private getGenerateCarsElement(): Element {
    const generateCars = document.createElement('div');

    const button = document.createElement('button');
    button.classList.add('button', 'generate-cars');
    button.innerText = 'Generate cars';

    button.addEventListener('click', () => {
      const result = this.client.generateCars();
      result.then(() => this.updateTable(this.page));
    });

    generateCars.append(button);

    return generateCars;
  }

  static getRaceControlsElement(): Element {
    const raceControls = document.createElement('div');
    raceControls.classList.add('race-controls');

    const buttonStart = document.createElement('button');
    buttonStart.classList.add('button', 'race-start');
    buttonStart.innerText = 'Start race';

    const buttonReset = document.createElement('button');
    buttonReset.classList.add('button', 'race-reset');
    buttonReset.innerText = 'Reset';

    raceControls.append(buttonStart, buttonReset);

    return raceControls;
  }
}
