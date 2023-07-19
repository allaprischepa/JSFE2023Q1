import {
  ICar,
  IQueryParams,
  IWinner,
  IWinnerCar,
} from '../../types/types';
import CarItem from '../view/car/carItem';

export default class APIClient {
  private baseURL = 'http://127.0.0.1:3000';

  private paths = {
    garage: '/garage',
    engine: '/engine',
    winners: '/winners',
  };

  public async getCars(page = 0, limit = 10) {
    const path = this.paths.garage;
    const query: IQueryParams = {
      _page: `${page}`,
      _limit: `${limit}`,
    };
    // const cars = await this.load<ICar[]>(path);
    const response = this.request(path, query);
    const result = response
      .then((res) => {
        const totalAmount = res.headers.get('X-Total-Count');
        return res.json().then((data: ICar[]) => ({ total: totalAmount, cars: data }));
      })
      .catch((error) => { console.log(error); });

    return result;
  }

  public async getWinners() {
    const path = this.paths.winners;
    const winners = await this.load<IWinner[]>(path);
    const cars = winners ? await this.getCarWinners(winners) : [];

    return cars;
  }

  private async getCarWinners(winners: IWinner[]) {
    const results = winners.map(async (winner: IWinner, ind: number) => {
      const car = await this.getCar(winner.id);
      const res: IWinnerCar = { ...winners[ind], name: car?.name || 'Name', color: car?.color || '#000' };

      return res;
    });

    return Promise.all(results);
  }

  public async getCar(id: number) {
    const path = `${this.paths.garage}/${id}`;
    const car = await this.load<ICar>(path);

    return car;
  }

  private request(path: string, query: IQueryParams = {}, options = {}) {
    const queryStr = APIClient.getQueryString(query);
    const endpoint = `${this.baseURL}${path}${queryStr}`;

    return fetch(endpoint, options);
  }

  static getQueryString(query: IQueryParams = {}): string {
    const queryParams: string[] = [];
    Object.keys(query).forEach((key) => queryParams.push(`${key}=${query[key]}`));

    return queryParams.length ? `?${queryParams.join('&')}` : '';
  }

  private async load<T>(path: string, options = {}): Promise<T> {
    const endpoint = `${this.baseURL}${path}`;

    return fetch(endpoint, options)
      .then((res) => res.json())
      .then((data: T) => data)
      .catch((error) => {
        console.log(error);

        return null;
      });
  }

  public generateCars(amount = 100) {
    const promises = [];

    for (let i = 1; i <= amount; i += 1) {
      const carName = CarItem.generateRandomName();
      const carColor = CarItem.generateRandomColor();

      promises.push(this.createSingleCar(carName, carColor));
    }

    return Promise.all(promises);
  }

  public createCar(carName: string, carColor: string) {
    return this.createSingleCar(carName, carColor);
  }

  private createSingleCar(carName: string, carColor: string) {
    const path = this.paths.garage;
    const requestObj = { name: carName, color: carColor };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestObj),
    };

    return this.load(path, options);
  }
}
