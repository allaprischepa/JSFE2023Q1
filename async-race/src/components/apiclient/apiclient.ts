import {
  DriveIndicators,
  ICar,
  IQueryParams,
  IWinner,
  IWinnerCar,
  TableContentObj,
} from '../../types/types';
import CarItem from '../view/car/carItem';

export default class APIClient {
  private baseURL = 'http://127.0.0.1:3000';

  private paths = {
    garage: '/garage',
    engine: '/engine',
    winners: '/winners',
  };

  public async getCars(page = 0, limit = 10): Promise<void | TableContentObj<ICar>> {
    const path = this.paths.garage;
    const query: IQueryParams = {
      _page: `${page}`,
      _limit: `${limit}`,
    };

    const response = this.request(path, query);
    const result = response
      .then((res) => {
        const totalAmount = res.headers.get('X-Total-Count');
        return res.json().then((data: ICar[]) => ({ total: totalAmount, cars: data }));
      })
      .catch((error) => { console.log(error); });

    return result;
  }

  public async getWinners(page = 0, limit = 10): Promise<void | TableContentObj<IWinnerCar>> {
    const path = this.paths.winners;
    const query: IQueryParams = {
      _page: `${page}`,
      _limit: `${limit}`,
    };

    const response = this.request(path, query);
    const result = response
      .then((res) => {
        const totalAmount = res.headers.get('X-Total-Count');
        return res.json().then(async (data: IWinner[]) => {
          const carsArr = await this.getCarWinners(data);
          return { total: totalAmount, cars: carsArr };
        });
      })
      .catch((error) => { console.log(error); });

    return result;
  }

  private async getCarWinners(winners: IWinner[]): Promise<IWinnerCar[]> {
    const results = winners.map(async (winner: IWinner, ind: number) => {
      const car = await this.getCar(winner.id);
      const res: IWinnerCar = { ...winners[ind], name: car?.name || 'Name', color: car?.color || '#000' };

      return res;
    });

    return Promise.all(results);
  }

  public async getCar(id: number): Promise<ICar> {
    const path = `${this.paths.garage}/${id}`;
    const car = await this.load<ICar>(path);

    return car;
  }

  public async getWinner(id: number): Promise<IWinner> {
    const path = `${this.paths.winners}/${id}`;
    const car = await this.load<IWinner>(path);

    return car;
  }

  private request(path: string, query: IQueryParams = {}, options = {}): Promise<Response> {
    const queryStr = APIClient.getQueryString(query);
    const endpoint = `${this.baseURL}${path}${queryStr}`;

    return fetch(endpoint, options);
  }

  static getQueryString(query: IQueryParams = {}): string {
    const queryParams: string[] = [];
    Object.keys(query).forEach((key) => queryParams.push(`${key}=${query[key]}`));

    return queryParams.length ? `?${queryParams.join('&')}` : '';
  }

  private async load<T>(path: string, query: IQueryParams = {}, options = {}): Promise<T> {
    return this.request(path, query, options)
      .then((res) => res.json())
      .then((data: T) => data)
      .catch((error) => {
        console.log(error);

        return null;
      });
  }

  public generateCars(amount = 100): Promise<ICar[]> {
    const promises = [];

    for (let i = 1; i <= amount; i += 1) {
      const carName = CarItem.generateRandomName();
      const carColor = CarItem.generateRandomColor();

      promises.push(this.createSingleCar(carName, carColor));
    }

    return Promise.all(promises);
  }

  public createCar(carName: string, carColor: string): Promise<ICar> {
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

    return this.load<ICar>(path, {}, options);
  }

  public removeCar(id: number): Promise<void> {
    const path = `${this.paths.garage}/${id}`;
    const options = {
      method: 'DELETE',
    };

    const winner = this.getWinner(id);
    winner.then((data: IWinner) => {
      if (data?.id) this.removeWinner(data.id);
    });

    return this.load<void>(path, {}, options);
  }

  public removeWinner(id: number): Promise<void> {
    const path = `${this.paths.winners}/${id}`;
    const options = {
      method: 'DELETE',
    };

    return this.load<void>(path, {}, options);
  }

  public updateCar(id: number, carName: string, carColor: string): Promise<ICar> {
    const path = `${this.paths.garage}/${id}`;
    const requestObj = { name: carName, color: carColor };
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestObj),
    };

    return this.load<ICar>(path, {}, options);
  }

  public startEngine(carID: number) {
    return this.startStopEngine(carID);
  }

  public stopEngine(carID: number) {
    return this.startStopEngine(carID, false);
  }

  public drive(carID: number) {
    const path = this.paths.engine;
    const query: IQueryParams = {
      id: carID,
      status: 'drive',
    };
    const options = { method: 'PATCH' };

    return this.load<DriveIndicators>(path, query, options);
  }

  private startStopEngine(carID: number, start = true) {
    const path = this.paths.engine;
    const query: IQueryParams = {
      id: carID,
      status: start ? 'started' : 'stopped',
    };
    const options = { method: 'PATCH' };

    return this.load<DriveIndicators>(path, query, options);
  }
}
