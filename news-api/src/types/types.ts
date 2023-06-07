export interface IOptions {
  [key: string]: string | undefined;
  apikey?: string;
  sources?: string;
}

export interface IRequest {
  endpoint: string;
  options?: IOptions;
}

export interface IData {
  articles?: [];
  sources?: [];
}

export interface INewsItem {
  urlToImage: string;
  author?: string;
  source: { name: string };
  publishedAt: string;
  title: string;
  description: string;
  url: string;
}

export interface ISourcesItem {
  name: string;
  id: string;
}

export type CallbackFunction = (() => void) | ((data: IData) => void);
