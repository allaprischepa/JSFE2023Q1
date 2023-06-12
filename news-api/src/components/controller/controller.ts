import { CallbackFunction, IDataNews, IDataSources, SourcesSelectors } from '../../types/types';
import { getElement } from '../../utils/utils';
import AppLoader from './appLoader';

class AppController extends AppLoader {
  public getSources(callback: CallbackFunction<IDataSources>): void {
    super.getResp({ endpoint: 'sources' }, callback);
  }

  public getNews(event: Event, callback: CallbackFunction<IDataNews>): void {
    let target = event.target as Element;
    const newsContainer = event.currentTarget as HTMLElement;

    while (target !== newsContainer) {
      if (target.classList.contains('source__item')) {
        const sourceId: string = target.getAttribute('data-source-id') || '';

        if (newsContainer.getAttribute('data-source') !== sourceId) {
          newsContainer.setAttribute('data-source', sourceId);

          // Remove previous active.
          const active = getElement('.active', newsContainer);
          active?.classList.remove('active');

          // Add active for current.
          target.classList.add('active');

          // Close menu.
          const handle = getElement(SourcesSelectors.handle, newsContainer);
          if (handle?.style.display !== 'none') handle?.click();

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
