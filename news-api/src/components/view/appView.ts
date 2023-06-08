import { IData } from '../../types/types';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
  news;
  sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: IData): void {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  public drawSources(data: IData): void {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
