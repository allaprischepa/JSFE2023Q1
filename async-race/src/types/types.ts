export type ICar = {
  id: number,
  name: string,
  color: string,
};

export type IWinner = {
  id: number,
  wins: number,
  time: number,
};

export type IWinnerCar = ICar & IWinner;

export type Attributes = {
  [index: string]: string;
};

export type IQueryParams = {
  [index: string]: string;
};

export type TableContentObj<T> = {
  total: string,
  cars: T[]
};
