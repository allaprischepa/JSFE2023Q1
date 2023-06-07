import { INewsItem } from '../../../types/types';
import './news.css';

class News {
  draw(data: INewsItem[]): void {
    const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

    const fragment = document.createDocumentFragment();
    const newsItemTemp = document.querySelector('#newsItemTemp') as HTMLTemplateElement;
    const newsContainer = document.querySelector('.news');

    if (fragment && newsItemTemp && newsContainer) {
      news.forEach((item, idx) => {
        const newsClone = newsItemTemp.content.cloneNode(true) as HTMLElement;

        const newsItem = newsClone.querySelector('.news__item');
        const newsMetaPhoto = newsClone.querySelector('.news__meta-photo') as HTMLElement;
        const newsMetaAutor = newsClone.querySelector('.news__meta-author');
        const newsMetaDate = newsClone.querySelector('.news__meta-date');
        const newsDescriptionTitle = newsClone.querySelector('.news__description-title');
        const newsDescriptionSource = newsClone.querySelector('.news__description-source');
        const newsDescriptionContent = newsClone.querySelector('.news__description-content');
        const newsReadMoreLink = newsClone.querySelector('.news__read-more a');

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
