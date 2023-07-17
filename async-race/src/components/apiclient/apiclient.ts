import { ICar, IWinner, IWinnerCar } from '../../types/types';

export default class APIClient {
  private baseURL = 'http://127.0.0.1:3000';

  private paths = {
    garage: '/garage',
    engine: '/engine',
    winners: '/winners',
  };

  public async getCars() {
    const path = this.paths.garage;
    const cars = await this.load<ICar[]>(path);

    return cars;
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

  private async load<T>(path: string): Promise<T> {
    const endpoint = `${this.baseURL}${path}`;

    return fetch(endpoint)
      .then((res) => res.json())
      .then((data: T) => data)
      .catch((error) => {
        console.log(error);

        return null;
      });
  }
}
