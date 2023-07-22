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
  [index: string]: string | number;
};

export type TableContentObj<T> = {
  total: string,
  cars: T[]
};

export type DriveIndicators = {
  velocity: number,
  distance: number,
};

export type DriveMode = {
  success: boolean,
};

export type Racer = {
  id: number,
  animation: Animation,
  broken?: boolean,
};
