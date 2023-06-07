import { CallbackFunction } from '../../types/types';
import AppLoader from './appLoader';

class AppController extends AppLoader {
  getSources(callback: CallbackFunction) {
    super.getResp({ endpoint: 'sources' }, callback);
  }

  getNews(e: Event, callback: CallbackFunction) {
    let target = e.target as Element;
    const newsContainer = e.currentTarget as Element;

    while (target !== newsContainer) {
      if (target.classList.contains('source__item')) {
        const sourceId: string = target.getAttribute('data-source-id') || '';

        if (newsContainer.getAttribute('data-source') !== sourceId) {
          newsContainer.setAttribute('data-source', sourceId);
          super.getResp(
            {
              endpoint: 'everything',
              options: {
                sources: sourceId,
              },
            },
            callback
          );
        }
        return;
      }

      target = target.parentNode as Element;
    }
  }
}

export default AppController;
