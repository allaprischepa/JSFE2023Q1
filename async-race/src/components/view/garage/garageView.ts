import {
  Attributes,
  DriveIndicators,
  DriveMode,
  ICar,
  Racer,
} from '../../../types/types';
import { createElement, toSeconds } from '../../../utils/utils';
import CarItem from '../car/carItem';
import View from '../view';

export default class GarageView extends View {
  public table: Element;

  private control: Element;

  private winMessage: Element;

  public pageLimit = 7;

  public page: number;

  private racers: Racer[] = [];

  private winnerID = 0;

  private raceStarted = false;

  constructor() {
    super('garage');

    this.page = 1;
    this.table = this.getTable();
    this.control = this.getControlElement();
    this.winMessage = GarageView.getWinMessage();
  }

  public getViewContent(): Element {
    const content = createElement('div', [`${this.type}-content`]);

    this.fillTable(this.page);

    content.append(this.control, this.table);

    this.listenEvents();

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
    const engineControls = this.getEngineControls(carData, carElement);

    name.innerText = carData.name;

    carInfo.append(editBtn, removeBtn, name);
    track.append(carElement);

    tableItem.append(carInfo, engineControls, track);
    parent.append(tableItem);
  }

  private getControlElement(): Element {
    const control = createElement('div', ['control']);

    const createCar = this.getCreateCarElement();
    const generateCars = this.getGenerateCarsElement();
    const raceControls = this.getRaceControlsElement();

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

    const createCar = createElement('div', ['controls_item']);
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
    const generateCars = createElement('div', ['controls_item']);
    const button = createElement('button', ['button', 'generate-cars']);
    button.innerText = 'Generate cars';

    button.addEventListener('click', () => {
      const result = this.client.generateCars();
      result.then(() => this.updateTable(this.page));
    });

    generateCars.append(button);

    return generateCars;
  }

  private getRaceControlsElement(): Element {
    const raceControls = createElement('div', ['controls_item', 'race-controls']);
    const buttonStart = createElement('button', ['button', 'race-start']);
    const buttonReset = createElement('button', ['button', 'race-reset']);

    buttonStart.innerText = 'Start race';
    buttonReset.innerText = 'Reset';

    buttonStart.addEventListener('click', () => this.startRace(buttonStart, buttonReset));
    buttonReset.addEventListener('click', () => this.resetRace());

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

  private getEngineControls(carData: ICar, car: Element): Element {
    const wrapper = createElement('div', ['engine-controls']);
    const start = createElement('a', ['engine-start']);
    const stop = createElement('a', ['engine-stop', 'inactive']);

    if (car) {
      start.addEventListener('click', () => this.engineStart(carData, car, start, stop));
      stop.addEventListener('click', () => this.engineStop(carData, car, start, stop));
    }

    wrapper.append(start, stop);

    return wrapper;
  }

  private engineStart(carData: ICar, car: Element, start: Element, stop: Element) {
    const response = this.client.startEngine(carData.id);
    start.classList.add('inactive');
    document.dispatchEvent(new CustomEvent('engineStart'));

    response.then((data: DriveIndicators) => {
      stop.classList.remove('inactive');

      const time = data.distance / data.velocity;
      const carAnimation = this.createCarAnimation(carData, car, time);
      this.racers.push({ id: carData.id, animation: carAnimation });

      carAnimation.play();

      const drive = this.client.drive(carData.id);
      drive.then((driveData: DriveMode) => {
        if (!driveData?.success) {
          const racer = this.racers.find((obj) => obj.id === carData.id);
          if (racer) racer.broken = true;

          carAnimation.pause();
          document.dispatchEvent(new CustomEvent('engineBroken'));
        }
      });
    });
  }

  private createCarAnimation(carData: ICar, car: Element, time: number) {
    const width = car.clientWidth ? `${car.clientWidth}px` : 'calc(2vw + 50px)';
    const effect = new KeyframeEffect(
      car,
      { left: ['0', `calc(100% - ${width}`] },
      { duration: time, fill: 'forwards' },
    );

    const carAnimation = new Animation(effect);

    carAnimation.addEventListener('finish', () => {
      if (this.raceStarted && !this.winnerID) {
        this.winnerID = carData.id;
        this.stopRace(carData, toSeconds(time));
      }
    });

    return carAnimation;
  }

  private engineStop(carData: ICar, car: Element, start: Element, stop: Element) {
    const response = this.client.stopEngine(carData.id);
    stop.classList.add('inactive');

    response.then(() => {
      start.classList.remove('inactive');
      const animation = this.getAnimation(carData);
      if (animation instanceof Animation) animation.cancel();

      document.dispatchEvent(new CustomEvent('engineStop'));
    });
  }

  private getAnimation(carData: ICar): Animation {
    let animation = null;
    const index = this.racers.findIndex((obj) => obj.id === carData.id);

    if (index !== -1) {
      animation = this.racers[index].animation;
      this.racers.splice(index, 1);
    }

    return animation;
  }

  private startRace(start: Element, reset: Element): void {
    this.winnerID = 0;
    this.raceStarted = true;
    [start, reset].forEach((el) => el.classList.add('inactive'));

    document.body.classList.add('race-started');
    this.table.querySelectorAll('.engine-start').forEach((el) => { if (el instanceof HTMLElement) el.click(); });
  }

  private stopRace(carData: ICar, time: number): void {
    this.winnerID = 0;
    this.raceStarted = false;
    this.activateResetButton();

    if (carData) {
      this.showWinnerMessage(carData.name, time);
      this.client.createWinner(carData.id, time)
        .then(GarageView.generateUpdateWinnersEvent);
    }
  }

  private resetRace(): void {
    this.table.querySelectorAll('.engine-stop').forEach((el) => { if (el instanceof HTMLElement) el.click(); });
  }

  static generateUpdateWinnersEvent(): void {
    document.dispatchEvent(new Event('updateWinners'));
  }

  private listenEvents(): void {
    document.addEventListener('engineStart', () => {
      this.inactivateStartButton();
      document.body.classList.add('drive-started');
    });

    document.addEventListener('engineStop', () => {
      if (!this.racers.length) {
        this.activateStartButton();
        document.body.classList.remove('race-started', 'drive-started');
      }
    });

    document.addEventListener('engineBroken', () => {
      if (this.racers.every((obj) => obj.broken)) {
        this.stopRace(null, 0);
      }
    });
  }

  private inactivateStartButton(): void {
    const buttonStart = this.control.querySelector('.race-start');
    if (buttonStart) buttonStart.classList.add('inactive');
  }

  private activateStartButton(): void {
    const buttonStart = this.control.querySelector('.race-start');
    if (buttonStart) buttonStart.classList.remove('inactive');
  }

  private activateResetButton(): void {
    const buttonReset = this.control.querySelector('.race-reset');
    if (buttonReset) buttonReset.classList.remove('inactive');
  }

  private showWinnerMessage(name: string, time: number) {
    const messageText = this.winMessage.querySelector('.text');

    if (messageText instanceof HTMLElement) {
      messageText.innerHTML = `<div class="winner"><strong>${name}</strong> won!</div><div>[${time} sec]</div>`;

      this.winMessage.classList.add('show');
      setTimeout(() => this.winMessage.classList.remove('show'), 5000);
    }
  }

  static getWinMessage(): Element {
    const banner = createElement('div', ['banner']);
    const bannerText = createElement('div', ['text']);
    bannerText.innerText = 'finish';

    banner.append(bannerText);
    document.body.append(banner);

    return banner;
  }
}
