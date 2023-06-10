import { AlphabetMap, ISource, SourcesSelectors } from '../../../types/types';
import { getElement, retrieveClass } from '../../../utils/utils';
import './sources.css';

class Sources {
  public draw(data: ISource[]): void {
    const fragment = document.createElement('div');
    const sourceItemTemp = getElement(SourcesSelectors.itemTemplate) as HTMLTemplateElement;
    const sources = getElement(SourcesSelectors.container);
    const groups: AlphabetMap = {};

    if (fragment && sourceItemTemp && sources) {
      data.forEach((item: ISource) => {
        const sourceClone = sourceItemTemp.content.cloneNode(true) as HTMLElement;

        if (sourceClone) {
          const sourceItemName = getElement(SourcesSelectors.itemName, sourceClone);
          const sourceItem = getElement(SourcesSelectors.item, sourceClone);
          const char = item.id.charAt(0).toUpperCase();

          if (sourceItemName) sourceItemName.textContent = item.name;
          if (sourceItem) sourceItem.setAttribute('data-source-id', item.id);

          if (!groups[char]) {
            groups[char] = document.createElement('div');
            groups[char].classList.add(retrieveClass(SourcesSelectors.group));
            groups[char].classList.add(`group-${char}`);
            groups[char].setAttribute('data-group', char);
          }

          groups[char].append(sourceClone);
          fragment.append(groups[char]);
        }
      });

      if (groups) {
        const alphabet = document.createElement('div');

        Object.keys(groups).forEach((key: keyof AlphabetMap) => {
          const span = document.createElement('span');
          span.innerText = `${key}`;
          span.setAttribute('data-char', `${key}`);
          span.classList.add(retrieveClass(SourcesSelectors.groupNavItem));
          alphabet.append(span);

          span.addEventListener('click', (e) => {
            const target = e.target as Element;
            const groupId = target.getAttribute('data-char');
            const group = getElement(`.group-${groupId}`, fragment);

            if (group) {
              const scrollTo = group.offsetTop - fragment.offsetTop;
              fragment.scrollTop = scrollTo;
            }
          });
        });

        alphabet.classList.add(retrieveClass(SourcesSelectors.groupNav));
        sources.append(alphabet);
      }

      fragment.classList.add(retrieveClass(SourcesSelectors.groupContainer));
      sources.append(fragment);

      // Add open button.
      const handle = document.createElement('div');
      handle.classList.add(retrieveClass(SourcesSelectors.handle));

      handle.addEventListener('click', () => {
        sources.classList.toggle('open');
      });

      sources.prepend(handle);

      sources.classList.add('open');
    }
  }
}

export default Sources;
