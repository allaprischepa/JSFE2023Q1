export class Description {
  private description: Element;
  private header: Element;
  private title: Element;
  private subtitle: Element;
  private syntax: Element;
  private help: Element;
  private eContainer: Element;

  constructor() {
    const description = document.createElement('div');
    description.classList.add('description');

    const header = document.createElement('h3');
    header.classList.add('level-header');

    const title = document.createElement('h4');
    title.classList.add('description-title');

    const subtitle = document.createElement('h5');
    subtitle.classList.add('description-subtitle');

    const syntax = document.createElement('div');
    syntax.classList.add('syntax');

    const help = document.createElement('div');
    help.classList.add('help');

    const examples = document.createElement('div');
    const eTitle = document.createElement('h5');
    const eContainer = document.createElement('div');
    eTitle.textContent = 'Examples';
    examples.classList.add('examples');
    eTitle.classList.add('examples__title');
    eContainer.classList.add('examples__container');
    examples.append(eTitle, eContainer);

    description.append(header, title, subtitle, syntax, help, examples);

    this.description = description;
    this.header = header;
    this.title = title;
    this.subtitle = subtitle;
    this.syntax = syntax;
    this.help = help;
    this.eContainer = eContainer;
  }

  public view(parent: Element = document.body): void {
    parent.append(this.description);
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
}
