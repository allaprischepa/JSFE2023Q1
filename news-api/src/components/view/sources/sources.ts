import { ISourcesItem } from '../../../types/types';
import './sources.css';

class Sources {
  public draw(data: ISourcesItem[]): void {
    const fragment = document.createDocumentFragment();
    const sourceItemTemp = document.querySelector('#sourceItemTemp') as HTMLTemplateElement;
    const sources = document.querySelector('.sources');

    if (fragment && sourceItemTemp && sources) {
      data.forEach((item) => {
        const sourceClone = sourceItemTemp.content.cloneNode(true) as HTMLElement;

        if (sourceClone) {
          const sourceItemName = sourceClone.querySelector('.source__item-name');
          const sourceItem = sourceClone.querySelector('.source__item');

          if (sourceItemName) sourceItemName.textContent = item.name;
          if (sourceItem) sourceItem.setAttribute('data-source-id', item.id);

          fragment.append(sourceClone);
        }
      });

      sources.append(fragment);
    }
  }
}

export default Sources;
