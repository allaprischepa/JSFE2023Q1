import { Selectors } from '../../types/types';

export class Description {
  private description: Element;
  private header: Element;
  private title: Element;
  private subtitle: Element;
  private syntax: Element;
  private help: Element;
  private eContainer: Element;
  private state: Element;
  private levelsList: Element;
  private resetProgress: Element;

  constructor() {
    [
      this.description,
      this.header,
      this.title,
      this.subtitle,
      this.syntax,
      this.help,
      this.eContainer,
      this.state,
      this.levelsList,
      this.resetProgress,
    ] = this.init();
  }

  private init(): Element[] {
    const description = document.createElement('div');
    const top = document.createElement('div');
    const bottom = document.createElement('div');
    top.classList.add('description-top');
    description.classList.add('description');
    description.append(top, bottom);

    const header = document.createElement('h3');
    header.classList.add('level-header');

    const close = document.createElement('span');
    close.classList.add('description-close');
    close.addEventListener('click', () => {
      const parent = description.parentElement;
      description.classList.remove('open');

      if (parent) parent.classList.remove('decription-opened');
    });

    const title = document.createElement('h4');
    title.classList.add('description-title');

    const subtitle = document.createElement('h5');
    subtitle.classList.add('description-subtitle');

    const syntax = document.createElement('div');
    syntax.classList.add('syntax');

    const help = document.createElement('div');
    help.classList.add('help');

    const examples = document.createElement('div');
    const eTitle = document.createElement('h4');
    const eContainer = document.createElement('div');
    eTitle.textContent = 'Examples';
    examples.classList.add('examples');
    eTitle.classList.add('examples__title');
    eContainer.classList.add('examples__container');
    examples.append(eTitle, eContainer);

    top.append(header, close);
    bottom.append(title, subtitle, syntax, help, examples);

    const state = document.createElement('div');
    state.classList.add('state');

    const levelsList = document.createElement('div');
    levelsList.classList.add('levels-list');

    const reset = document.createElement('a');
    reset.classList.add(Selectors.resetProgress);
    reset.innerText = 'Reset Progress';
    state.append(levelsList, reset);

    return [description, header, title, subtitle, syntax, help, eContainer, state, levelsList, reset];
  }

  public view(parent: Element = document.body): void {
    parent.append(this.description);
    parent.append(this.state);
  }

  public getHeader(): Element {
    return this.header;
  }

  public getTitle(): Element {
    return this.title;
  }

  public getSubtitle(): Element {
    return this.subtitle;
  }

  public getSyntax(): Element {
    return this.syntax;
  }

  public getHelp(): Element {
    return this.help;
  }

  public getExamplesContainer(): Element {
    return this.eContainer;
  }

  public getLevelsList(): Element {
    return this.levelsList;
  }

  public getDescription(): Element {
    return this.description;
  }

  public getResetProgressButton(): Element {
    return this.resetProgress;
  }
}
