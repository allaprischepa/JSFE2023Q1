export default class Minesweeper {
  /**
   * Initialize all variables and blocks.
   */
  init() {
    this.selectors = {
      main: 'minesweeper',
      mode: 'minesweeper__mode',
      minesCount: 'minesweeper__mines-count',
      field: 'minesweeper__field',
      theme: 'minesweeper__theme',
    };

    this.mode = localStorage.getItem('mode') || 'easy';
    this.minesCount = localStorage.getItem('minesCount') || 10;
    this.theme = localStorage.getItem('theme') || 'light';
    this.sound = localStorage.getItem('sound') || 'on';

    this.body = document.querySelector('body');
    this.body.className = 'page';
    document.documentElement.className = `theme-${this.theme}`;

    this.mainBlock = this.addMainBlock();
    this.themeSwitcherBlock = this.addThemeSwitcherBlock();
    this.soundSwitcherBlock = this.addSoundSwitcherBlock();
    [this.modeBlock, this.countBlock] = this.addSettingsBlock();
    this.gameFieldBlock = this.addGameFieldBlock();

    this.listenThemeChange();
    this.listenSoundChange();
    this.listenModeChange();
    this.listenMinesCountChange();
  }

  /**
   * Add main Minesweeper block.
   * @returns
   */
  addMainBlock() {
    const mainBlock = document.createElement('div');
    mainBlock.classList = this.selectors.main;
    this.body.appendChild(mainBlock);

    return mainBlock;
  }

  /**
   * Add Theme switcher.
   * @returns
   */
  addThemeSwitcherBlock() {
    const themeSwitcherBlock = document.createElement('div');
    themeSwitcherBlock.classList = this.selectors.theme;

    const input = document.createElement('input');
    const inputID = 'theme-switcher';
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', inputID);
    input.classList = 'theme-switcher__input';
    if (this.theme === 'light') input.checked = true;

    const span = document.createElement('span');
    span.classList = 'theme-switcher__toggle';

    const label = document.createElement('label');
    label.setAttribute('for', inputID);
    label.appendChild(input);
    label.appendChild(span);

    themeSwitcherBlock.appendChild(label);
    this.mainBlock.appendChild(themeSwitcherBlock);

    return themeSwitcherBlock;
  }

  /**
   * Add Sound switcher.
   * @returns
   */
  addSoundSwitcherBlock() {
    const soundSwitcherBlock = document.createElement('div');
    soundSwitcherBlock.classList = this.selectors.theme;

    const input = document.createElement('input');
    const inputID = 'sound-switcher';
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', inputID);
    input.classList = 'sound-switcher__input';
    if (this.sound === 'on') input.checked = true;

    const span = document.createElement('span');
    span.classList = 'sound-switcher__toggle';

    const label = document.createElement('label');
    label.setAttribute('for', inputID);
    label.appendChild(input);
    label.appendChild(span);

    soundSwitcherBlock.appendChild(label);
    this.mainBlock.appendChild(soundSwitcherBlock);

    return soundSwitcherBlock;
  }

  /**
   * Add Minesweeper Settings block.
   * @returns
   */
  addSettingsBlock() {
    // Create Mode block.
    const modes = ['easy', 'medium', 'hard'];
    const modeBlock = document.createElement('div');
    modeBlock.classList = this.selectors.mode;

    const modeBlockName = document.createElement('div');
    modeBlockName.classList = 'setting-name';
    modeBlockName.innerText = 'Mode';
    modeBlock.appendChild(modeBlockName);

    const modesWrapper = document.createElement('div');
    modesWrapper.classList = 'setting-block';
    modeBlock.appendChild(modesWrapper);

    modes.forEach((mode) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      const inputID = `mode-${mode}`;
      const inputAttrs = {
        type: 'radio',
        name: 'mode',
        id: inputID,
        value: mode,
      };

      Object.entries(inputAttrs).forEach(([key, value]) => {
        input.setAttribute(key, value);
      });
      if (mode === this.mode) {
        input.checked = true;
      }
      label.setAttribute('for', inputID);
      label.innerText = Minesweeper.capitalize(mode);

      label.appendChild(input);
      modesWrapper.appendChild(label);
    });

    // Create Mines count block.
    const countBlock = document.createElement('div');
    countBlock.classList = this.selectors.minesCount;

    const countBlockName = document.createElement('div');
    countBlockName.classList = 'setting-name';
    countBlockName.innerText = 'Mines';
    countBlock.appendChild(countBlockName);

    const countWrapper = document.createElement('div');
    countWrapper.classList = 'setting-block';
    countBlock.appendChild(countWrapper);

    const countInput = document.createElement('input');
    const countValue = document.createElement('span');
    countValue.classList = 'mines-count__value';
    countValue.innerText = this.minesCount;

    const rangeID = 'count';
    const rangeAttrs = {
      type: 'range',
      min: 10,
      max: 99,
      step: 1,
      id: rangeID,
      name: rangeID,
      value: this.minesCount,
    };

    Object.entries(rangeAttrs).forEach(([key, value]) => {
      countInput.setAttribute(key, value);
    });

    countWrapper.appendChild(countInput);
    countWrapper.appendChild(countValue);

    this.mainBlock.appendChild(modeBlock);
    this.mainBlock.appendChild(countBlock);

    return [modeBlock, countBlock];
  }

  /**
   * Add Minesweeper field block.
   * @returns
   */
  addGameFieldBlock() {
    const gameFieldBlock = document.createElement('div');
    const rowsCount = 10;
    gameFieldBlock.classList = `${this.selectors.field} field_rows_${rowsCount}`;

    // Generate cells.
    for (let row = 0; row < rowsCount; row += 1) {
      for (let column = 0; column < 10; column += 1) {
        const cell = document.createElement('div');
        cell.classList = `cell cell_${row}_${column} cell_closed`;
        gameFieldBlock.appendChild(cell);
      }
    }

    this.mainBlock.appendChild(gameFieldBlock);

    return gameFieldBlock;
  }

  /**
   * Listen changing of theme.
   */
  listenThemeChange() {
    const input = this.themeSwitcherBlock.querySelector('input');

    input.addEventListener('change', () => {
      const newTheme = this.theme === 'light' ? 'dark' : 'light';

      this.updateProperty('theme', newTheme);
      document.documentElement.className = `theme-${newTheme}`;
    });
  }

  /**
   * Listen changing of sound settings.
   */
  listenSoundChange() {
    const input = this.soundSwitcherBlock.querySelector('input');

    input.addEventListener('change', () => {
      const newSetting = this.sound === 'on' ? 'off' : 'on';

      this.updateProperty('sound', newSetting);
    });
  }

  /**
   * Listen changing of game mode.
   */
  listenModeChange() {
    const radios = this.modeBlock.querySelectorAll('input[name="mode"]');
    radios.forEach((radio) => {
      radio.addEventListener('change', (event) => {
        const { target } = event;
        const currentValue = target.getAttribute('value');

        this.updateProperty('mode', currentValue);
      });
    });
  }

  /**
   * Listen changing of mines count.
   */
  listenMinesCountChange() {
    const input = this.countBlock.querySelector('input[name="count"]');
    const span = this.countBlock.querySelector('.mines-count__value');

    input.addEventListener('input', (event) => {
      span.innerText = event.target.value;
    });

    input.addEventListener('change', (event) => {
      const { target } = event;
      const currentValue = target.value;

      target.setAttribute('value', currentValue);
      this.updateProperty('minesCount', currentValue);
    });
  }

  /**
   * Update Minesweeper object property and localStorage item.
   * @param {*} property
   * @param {*} value
   */
  updateProperty(property, value) {
    localStorage.setItem(property, value);
    this[property] = value;
  }

  /**
   * Transform first letter of the word to upper case.
   * @param {*} word
   * @returns
   */
  static capitalize(word) {
    const firstLetter = word.charAt(0).toUpperCase();
    const otherLetters = word.slice(1);

    return `${firstLetter}${otherLetters}`;
  }
}
