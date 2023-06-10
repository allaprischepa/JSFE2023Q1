export interface IOptions {
  [key: string]: string | undefined;
  apikey?: string;
  sources?: string;
}

export interface IRequest {
  endpoint: string;
  options: IOptions;
}

export interface ISource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

export interface IArticle {
  source: { id: string; name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface IDataSources extends Response {
  sources: ISource[];
}

export interface IDataNews extends Response {
  articles: IArticle[];
}

export type DataType = IDataNews | IDataSources | undefined;
export type CallbackFunction = {
  (data: DataType): void;
  (data: IDataNews): void;
  (data: IDataSources): void;
  (data: undefined): void;
};

export enum NewsSelectors {
  itemTemplate = '#newsItemTemp',
  container = '.news',
  item = '.news__item',
  metaPhoto = '.news__meta-photo',
  metaAuthor = '.news__meta-author',
  metaDate = '.news__meta-date',
  descriptionTitle = '.news__description-title',
  descriptionSource = '.news__description-source',
  descriptionContent = '.news__description-content',
  readMoreLink = '.news__read-more a',
}

export enum SourcesSelectors {
  itemTemplate = '#sourceItemTemp',
  container = '.sources',
  item = '.source__item',
  itemName = '.source__item-name',
  group = '.group',
  groupNav = '.group-nav',
  groupNavItem = '.group-nav__item',
  groupContainer = '.group-container',
  handle = '.sources__handle',
}

export type AlphabetMap = {
  [key: string]: HTMLElement;
};
