import { ISource, SourcesSelectors } from '../../../types/types';
import { getElement } from '../../../utils/utils';
import './sources.css';

class Sources {
  public draw(data: ISource[]): void {
    const fragment = document.createDocumentFragment();
    const sourceItemTemp = getElement(SourcesSelectors.itemTemplate) as HTMLTemplateElement;
    const sources = getElement(SourcesSelectors.container);

    if (fragment && sourceItemTemp && sources) {
      data.forEach((item: ISource) => {
        const sourceClone = sourceItemTemp.content.cloneNode(true) as HTMLElement;

        if (sourceClone) {
          const sourceItemName = getElement(SourcesSelectors.itemName, sourceClone);
          const sourceItem = getElement(SourcesSelectors.item, sourceClone);

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
