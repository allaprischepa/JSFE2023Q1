import { IArticle, NewsSelectors } from '../../../types/types';
import { getElement } from '../../../utils/utils';
import './news.css';

class News {
  public draw(data: IArticle[]): void {
    const news = data.length >= 10 ? data.filter((_item: IArticle, idx: number) => idx < 10) : data;

    const fragment = document.createDocumentFragment();
    const newsItemTemp = getElement(NewsSelectors.itemTemplate) as HTMLTemplateElement;
    const newsContainer = getElement(NewsSelectors.container);

    if (fragment && newsItemTemp && newsContainer) {
      news.forEach((item: IArticle, idx: number) => {
        const newsClone = newsItemTemp.content.cloneNode(true) as HTMLElement;

        const newsItem = getElement(NewsSelectors.item, newsClone);
        const newsMetaPhoto = getElement(NewsSelectors.metaPhoto, newsClone);
        const newsMetaAutor = getElement(NewsSelectors.metaAuthor, newsClone);
        const newsMetaDate = getElement(NewsSelectors.metaDate, newsClone);
        const newsDescriptionTitle = getElement(NewsSelectors.descriptionTitle, newsClone);
        const newsDescriptionSource = getElement(NewsSelectors.descriptionSource, newsClone);
        const newsDescriptionContent = getElement(NewsSelectors.descriptionContent, newsClone);
        const newsReadMoreLink = getElement(NewsSelectors.readMoreLink, newsClone);

        if (newsClone) {
          if (idx % 2 && newsItem) newsItem.classList.add('alt');

          if (newsMetaPhoto)
            newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
          if (newsMetaAutor) newsMetaAutor.textContent = item.author || item.source.name;
          if (newsMetaDate) newsMetaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

          if (newsDescriptionTitle) newsDescriptionTitle.textContent = item.title;
          if (newsDescriptionSource) newsDescriptionSource.textContent = item.source.name;
          if (newsDescriptionContent) newsDescriptionContent.textContent = item.description;
          if (newsReadMoreLink) newsReadMoreLink.setAttribute('href', item.url);

          fragment.append(newsClone);
        }
      });

      newsContainer.innerHTML = '';
      newsContainer.appendChild(fragment);
    }
  }
}

export default News;
