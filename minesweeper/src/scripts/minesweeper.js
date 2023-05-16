export default class Minesweeper {
  /**
   * Initialize all variables and blocks.
   */
  init() {
    this.selectors = {
      main: 'minesweeper',
      header: 'minesweeper__header',
      mode: 'minesweeper__mode',
      minesCount: 'minesweeper__mines-count',
      gameBlock: 'minesweeper__game',
      stat: 'minesweeper__stat',
      remaining: 'stat__remaining',
      flags: 'stat__flags',
      steps: 'stat__steps',
      time: 'stat__time',
      restart: 'restart',
      field: 'minesweeper__field',
      theme: 'minesweeper__theme',
      sound: 'minesweeper__sound',
      flagged: 'type_f',
    };

    this.body = document.querySelector('body');
    this.body.className = 'page';
    document.documentElement.className = `theme-${Minesweeper.getProperty('theme')}`;

    this.mainBlock = this.addMainBlock();
    this.themeSwitcherBlock = this.addThemeSwitcherBlock();
    this.soundSwitcherBlock = this.addSoundSwitcherBlock();
    [this.modeBlock, this.countBlock] = this.addSettingsBlock();
    this.gameBlock = this.addGameBlock();
    this.gameFieldBlock = this.addGameFieldBlock();

    this.listenThemeChange();
    this.listenSoundChange();
    this.listenModeChange();
    this.listenMinesCountChange();
    this.listenRestartButtonClick();

    this.initializeGame(false);
  }

  /**
   * Add main Minesweeper block.
   * @returns
   */
  addMainBlock() {
    const mainBlock = document.createElement('div');
    mainBlock.classList = this.selectors.main;

    const header = document.createElement('h1');
    header.classList = this.selectors.header;
    header.innerText = 'Minesweeper';
    mainBlock.appendChild(header);

    ['first', 'second', 'third'].forEach((row) => {
      const block = document.createElement('div');
      block.classList = `minesweeper__row-${row}`;
      mainBlock.appendChild(block);
    });

    this.body.appendChild(mainBlock);

    return mainBlock;
  }

  /**
   * Add Theme switcher.
   * @returns
   */
  addThemeSwitcherBlock() {
    const firstRow = this.mainBlock.querySelector('.minesweeper__row-first');
    const themeSwitcherBlock = document.createElement('div');
    themeSwitcherBlock.classList = this.selectors.theme;

    const input = document.createElement('input');
    const inputID = 'theme-switcher';
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', inputID);
    input.classList = 'theme-switcher__input';
    if (Minesweeper.getProperty('theme') === 'light') input.checked = true;

    const span = document.createElement('span');
    span.classList = 'theme-switcher__toggle';

    const label = document.createElement('label');
    label.setAttribute('for', inputID);
    label.appendChild(input);
    label.appendChild(span);

    themeSwitcherBlock.appendChild(label);
    firstRow.appendChild(themeSwitcherBlock);
    this.mainBlock.appendChild(firstRow);

    return themeSwitcherBlock;
  }

  /**
   * Add Sound switcher.
   * @returns
   */
  addSoundSwitcherBlock() {
    const firstRow = this.mainBlock.querySelector('.minesweeper__row-first');
    const soundSwitcherBlock = document.createElement('div');
    soundSwitcherBlock.classList = this.selectors.sound;

    const input = document.createElement('input');
    const inputID = 'sound-switcher';
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', inputID);
    input.classList = 'sound-switcher__input';
    if (Minesweeper.getProperty('sound') === 'on') input.checked = true;

    const span = document.createElement('span');
    span.classList = 'sound-switcher__toggle';

    const label = document.createElement('label');
    label.setAttribute('for', inputID);
    label.appendChild(input);
    label.appendChild(span);

    soundSwitcherBlock.appendChild(label);
    firstRow.appendChild(soundSwitcherBlock);
    this.mainBlock.appendChild(firstRow);

    return soundSwitcherBlock;
  }

  /**
   * Add Minesweeper Settings block.
   * @returns
   */
  addSettingsBlock() {
    const secondRow = this.mainBlock.querySelector('.minesweeper__row-second');

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
      const input = document.createElement('input');
      const inputID = `mode-${mode}`;
      const inputAttrs = {
        type: 'radio',
        name: 'mode',
        id: inputID,
        value: mode,
        label: Minesweeper.capitalize(mode),
      };

      Object.entries(inputAttrs).forEach(([key, value]) => {
        input.setAttribute(key, value);
      });
      if (mode === Minesweeper.getProperty('mode')) {
        input.checked = true;
      }

      input.classList = inputID;
      modesWrapper.appendChild(input);
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
    countValue.innerText = Minesweeper.getProperty('minesCount');

    const rangeID = 'count';
    const rangeAttrs = {
      type: 'range',
      min: 10,
      max: 99,
      step: 1,
      id: rangeID,
      name: rangeID,
      value: Minesweeper.getProperty('minesCount'),
      class: rangeID,
    };

    Object.entries(rangeAttrs).forEach(([key, value]) => {
      countInput.setAttribute(key, value);
    });

    countWrapper.appendChild(countInput);
    countWrapper.appendChild(countValue);

    secondRow.appendChild(modeBlock);
    secondRow.appendChild(countBlock);

    this.mainBlock.appendChild(secondRow);

    return [modeBlock, countBlock];
  }

  /**
   * Add game block.
   * @returns
   */
  addGameBlock() {
    const thirdRow = this.mainBlock.querySelector('.minesweeper__row-third');
    const gameBlock = document.createElement('div');
    gameBlock.classList = this.selectors.gameBlock;
    thirdRow.appendChild(gameBlock);
    this.mainBlock.appendChild(thirdRow);

    const statBlock = document.createElement('div');
    statBlock.classList = this.selectors.stat;
    gameBlock.appendChild(statBlock);

    // Add remaining mines count and flags.
    const firstBlock = document.createElement('div');
    const remainingMines = document.createElement('div');
    remainingMines.classList = this.selectors.remaining;
    remainingMines.innerText = Minesweeper.getProperty('minesCount');
    firstBlock.appendChild(remainingMines);

    const flags = document.createElement('div');
    flags.classList = this.selectors.flags;
    flags.innerText = 0;
    firstBlock.appendChild(flags);

    // Add restart button.
    const secondBlock = document.createElement('div');
    const restart = document.createElement('button');
    restart.classList = this.selectors.restart;
    secondBlock.appendChild(restart);

    // Add steps and time.
    const thirdBlock = document.createElement('div');
    const time = document.createElement('div');
    time.classList = this.selectors.time;
    time.innerText = 0;
    thirdBlock.appendChild(time);

    const steps = document.createElement('div');
    steps.classList = this.selectors.steps;
    steps.innerText = 0;
    thirdBlock.appendChild(steps);

    statBlock.appendChild(firstBlock);
    statBlock.appendChild(secondBlock);
    statBlock.appendChild(thirdBlock);

    return gameBlock;
  }

  /**
   * Add Minesweeper field block.
   * @returns
   */
  addGameFieldBlock() {
    const gameFieldBlock = document.createElement('div');
    this.gameBlock.appendChild(gameFieldBlock);

    return gameFieldBlock;
  }

  /**
   * Add cells.
   */
  addCells() {
    const cells = Minesweeper.getSavedState();
    const rowsCount = Minesweeper.getRowsCount();
    this.gameFieldBlock.innerHTML = '';
    this.gameFieldBlock.classList = `${this.selectors.field} field_rows_${rowsCount}`;
    this.gameBlock.classList = `${this.selectors.gameBlock} game_rows_${rowsCount}`;

    // Generate cells.
    for (let row = 0; row < rowsCount; row += 1) {
      for (let column = 0; column < rowsCount; column += 1) {
        const cell = document.createElement('div');
        cell.id = `cell_${row}_${column}`;
        cell.classList = `cell ${cell.id}`;
        if (cells[cell.id].opened) {
          cell.classList.add('cell_opened');
          cell.classList.add(`type_${cells[cell.id].type}`);

          if (cells[cell.id].exploded) {
            cell.classList.add('cell_exploded');
          }
        } else {
          if (cells[cell.id].flagged) cell.classList.add('type_f');
          cell.classList.add('cell_closed');
        }
        this.gameFieldBlock.appendChild(cell);
      }
    }

    this.listenClickOnCell();
  }

  /**
   * Listen changing of theme.
   */
  listenThemeChange() {
    const input = this.themeSwitcherBlock.querySelector('input');

    input.addEventListener('change', () => {
      const newTheme = Minesweeper.getProperty('theme') === 'light' ? 'dark' : 'light';

      Minesweeper.updateProperty('theme', newTheme);
      document.documentElement.className = `theme-${newTheme}`;
    });
  }

  /**
   * Listen changing of sound settings.
   */
  listenSoundChange() {
    const input = this.soundSwitcherBlock.querySelector('input');

    input.addEventListener('change', () => {
      const newSetting = Minesweeper.getProperty('sound') === 'on' ? 'off' : 'on';

      Minesweeper.updateProperty('sound', newSetting);
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
        const defaultMinesCount = Minesweeper.getDefaultMinesCount(currentValue);
        const countInput = this.countBlock.querySelector('input[name="count"]');
        countInput.value = defaultMinesCount;

        countInput.dispatchEvent(new Event('change'));
        Minesweeper.updateProperty('mode', currentValue);
        this.initializeGame();
      });
    });
  }

  /**
   * Listen changing of mines count.
   */
  listenMinesCountChange() {
    const input = this.countBlock.querySelector('input[name="count"]');

    input.addEventListener('input', (event) => {
      const span = this.countBlock.querySelector('.mines-count__value');
      span.innerText = event.target.value;
    });

    input.addEventListener('change', (event) => {
      const span = this.countBlock.querySelector('.mines-count__value');
      const { target } = event;
      const currentValue = target.value;
      span.innerText = currentValue;

      target.setAttribute('value', currentValue);
      Minesweeper.updateProperty('minesCount', currentValue);
      this.initializeGame();
    });
  }

  /**
   * Listen clicking on cell.
   */
  listenClickOnCell() {
    const cells = this.gameFieldBlock.querySelectorAll('.cell');

    cells.forEach((cell) => {
      cell.addEventListener('click', (event) => {
        if (this.isMarked(cell) || Minesweeper.getProperty('gameFinished')) {
          event.preventDefault();
        } else {
          if (!Minesweeper.getProperty('gameStarted')) this.startGame();
          if (Minesweeper.getProperty('firstClick')) {
            Minesweeper.setMines(cell.id);
            Minesweeper.updateProperty('firstClick', 0);
          }

          this.openCell(cell.id);

          // Count steps.
          Minesweeper.updateProperty('steps', Minesweeper.getProperty('steps') + 1);
          this.setSteps();
        }
      });
      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        if (!Minesweeper.getProperty('gameFinished')) {
          if (!Minesweeper.getProperty('gameStarted')) this.startGame();

          if (!this.isMarked(cell)) {
            if (Minesweeper.getProperty('flags') < Minesweeper.getProperty('minesCount')) {
              this.markFlagged(cell.id);
            }
          } else {
            this.markFlagged(cell.id, false);
          }
        }
      });
    });
  }

  /**
   * Listen click on restart button.
   */
  listenRestartButtonClick() {
    const restartBtn = this.gameBlock.querySelector(`.${this.selectors.restart}`);

    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.initializeGame());
    }
  }

  /**
   * Get stored property.
   * @param {*} name
   * @returns
   */
  static getProperty(name) {
    let defaultValue = '';
    let value = localStorage.getItem(name);

    if (!value) {
      switch (name) {
        case 'mode':
          defaultValue = 'easy';
          break;

        case 'minesCount':
          defaultValue = 10;
          break;

        case 'theme':
          defaultValue = 'light';
          break;

        case 'sound':
          defaultValue = 'on';
          break;

        case 'flags':
          defaultValue = 0;
          break;

        case 'gameStarted':
          defaultValue = 0;
          break;

        case 'firstClick':
          defaultValue = 1;
          break;

        case 'gameFinished':
          defaultValue = 0;
          break;

        case 'steps':
          defaultValue = 0;
          break;

        case 'time':
          defaultValue = 0;
          break;

        default:
      }

      value = Minesweeper.updateProperty(name, defaultValue);
    } else if (['minesCount', 'flags', 'gameStarted', 'firstClick', 'gameFinished', 'steps', 'time'].includes(name)) {
      value = +value;
    }

    return value;
  }

  /**
   * Update Minesweeper object property and localStorage item.
   * @param {*} property
   * @param {*} value
   */
  static updateProperty(property, value) {
    localStorage.setItem(property, value);

    return value;
  }

  /**
   * Get amount of rows according to mode.
   * @returns
   */
  static getRowsCount() {
    switch (Minesweeper.getProperty('mode')) {
      case 'easy':
        return 10;
      case 'medium':
        return 15;
      default:
        return 25;
    }
  }

  /**
   * Get default amount of mines according to mode.
   * @param {*} mode
   * @returns
   */
  static getDefaultMinesCount(mode) {
    switch (mode) {
      case 'easy':
        return 10;
      case 'medium':
        return 40;
      default:
        return 99;
    }
  }

  /**
   * Initialize game.
   */
  initializeGame(newGame = true) {
    if (newGame) {
      Minesweeper.updateProperty('gameStarted', 0);
      Minesweeper.updateProperty('gameFinished', 0);
      Minesweeper.updateProperty('firstClick', 1);
      Minesweeper.updateProperty('flags', 0);
      Minesweeper.updateProperty('steps', 0);
      Minesweeper.setCells();
      this.clearTimer();
    } else if (!Minesweeper.getProperty('gameFinished')) {
      this.startTimer();
    }

    this.setFlags();
    this.setRemaining();
    this.setSteps();
    this.setTime();
    this.addCells();
  }

  /**
   * Check if cell is flagged.
   * @param {*} cell
   * @returns
   */
  isMarked(cell) {
    return cell.classList.contains(this.selectors.flagged);
  }

  /**
   * Mark cell with flag.
   * @param {*} cell
   * @param {*} mark
   */
  markFlagged(id, mark = true) {
    const cells = Minesweeper.getSavedState();
    const cell = this.gameFieldBlock.querySelector(`#${id}`);

    if (mark) {
      if (!cells[id].flagged) {
        cells[id].flagged = 1;
        cell.classList.add(this.selectors.flagged);
        Minesweeper.updateProperty('flags', Minesweeper.getProperty('flags') + 1);
      }
    } else if (cells[id].flagged) {
      cells[id].flagged = 0;
      cell.classList.remove(this.selectors.flagged);
      Minesweeper.updateProperty('flags', Minesweeper.getProperty('flags') - 1);
    }

    Minesweeper.setSavedState(cells);
    this.setFlags();
    this.setRemaining();
  }

  /**
   * Start game.
   */
  startGame() {
    Minesweeper.updateProperty('gameStarted', 1);

    // Set timer.
    this.startTimer();
  }

  /**
   * Start timer.
   */
  startTimer() {
    const timerElement = this.gameBlock.querySelector(`.${this.selectors.time}`);
    this.setTime();

    this.timer = setInterval(() => {
      const newTime = Minesweeper.getProperty('time') + 1;
      timerElement.innerText = newTime;
      Minesweeper.updateProperty('time', newTime);

      if (newTime === 999) this.finishGame();
    }, 1000);
  }

  /**
   * Set time in block.
   */
  setTime() {
    const timerElement = this.gameBlock.querySelector(`.${this.selectors.time}`);
    timerElement.innerText = Minesweeper.getProperty('time');
  }

  /**
   * Finish game.
   */
  finishGame(won = false) {
    const cells = Minesweeper.getSavedState();

    Minesweeper.updateProperty('gameStarted', 0);
    Minesweeper.updateProperty('gameFinished', 1);
    Minesweeper.updateProperty('firstClick', 1);

    if (won) {
      // If won mark all mines with flags.
      Object.entries(cells).forEach(([cellID, cell]) => {
        if (cell.type === 'm' && !cell.flagged) {
          this.markFlagged(cellID);
        }
      });
    } else {
      // If lost show all mines.
      Object.entries(cells).forEach(([cellID, cell]) => {
        if (cell.type === 'm' && !cell.opened) {
          this.markFlagged(cellID, false);
          this.openCell(cellID, true);
        }
      });
    }

    this.stopTimer();
  }

  /**
   * Clear time block and stop timer.
   */
  clearTimer() {
    const timerElement = this.gameBlock.querySelector('.stat__time');
    timerElement.innerText = 0;
    Minesweeper.updateProperty('time', 0);

    this.stopTimer();
  }

  /**
   * Stop timer.
   */
  stopTimer() {
    clearInterval(this.timer);
  }

  /**
   * Set flags counter.
   */
  setFlags() {
    const flags = this.gameBlock.querySelector(`.${this.selectors.flags}`);
    flags.innerText = Minesweeper.getProperty('flags');
  }

  /**
   * Set remaining mines counter.
   */
  setRemaining() {
    const remainingMines = this.gameBlock.querySelector(`.${this.selectors.remaining}`);
    remainingMines.innerText = Minesweeper.getProperty('minesCount') - Minesweeper.getProperty('flags');
  }

  /**
   * Set steps.
   */
  setSteps() {
    const steps = this.gameBlock.querySelector(`.${this.selectors.steps}`);
    steps.innerText = Minesweeper.getProperty('steps');
  }

  /**
   * Get saved state.
   * @returns
   */
  static getSavedState() {
    const saved = localStorage.getItem('savedState');
    const cells = saved ? JSON.parse(saved) : Minesweeper.setCells();

    return cells;
  }

  /**
   * Save current state.
   * @param {*} cells
   */
  static setSavedState(cells) {
    const saved = JSON.stringify(cells);

    Minesweeper.updateProperty('savedState', saved);
  }

  /**
   * Set cells array.
   * @returns
   */
  static setCells() {
    const rowsCount = Minesweeper.getRowsCount();
    const cells = {};

    // Generate cells.
    for (let row = 0; row < rowsCount; row += 1) {
      for (let column = 0; column < rowsCount; column += 1) {
        cells[`cell_${row}_${column}`] = {
          type: 0,
          flagged: 0,
          opened: 0,
        };
      }
    }

    Minesweeper.setSavedState(cells);

    return cells;
  }

  /**
   * Set mines.
   * @param {*} exclude
   */
  static setMines(exclude) {
    const rowsCount = Minesweeper.getRowsCount();
    const cells = Minesweeper.getSavedState();
    let addedMines = 0;

    // Set mines.
    while (addedMines < Minesweeper.getProperty('minesCount')) {
      const row = Math.floor(Math.random() * rowsCount);
      const column = Math.floor(Math.random() * rowsCount);
      const cellID = `cell_${row}_${column}`;

      if (cellID !== exclude && cells[cellID].type !== 'm') {
        cells[cellID].type = 'm';
        addedMines += 1;

        for (let i = row - 1; i <= row + 1; i += 1) {
          for (let j = column - 1; j <= column + 1; j += 1) {
            const lookingID = `cell_${i}_${j}`;
            if (!(cells[lookingID] === undefined) && !(i === row && j === column)) {
              if (cells[lookingID].type !== 'm') cells[lookingID].type += 1;
            }
          }
        }
      }
    }

    Minesweeper.setSavedState(cells);
  }

  /**
   * Open the cell.
   * @param {*} id
   */
  openCell(id, afterFinish = false) {
    const cells = Minesweeper.getSavedState();

    if (!cells[id].opened) {
      const rowsCount = Minesweeper.getRowsCount();
      const cell = this.gameFieldBlock.querySelector(`#${id}`);

      cell.classList.remove('cell_closed');
      cell.classList.add('cell_opened');
      cell.classList.add(`type_${cells[id].type}`);

      cells[id].opened = 1;
      Minesweeper.setSavedState(cells);

      if (cells[id].flagged) {
        this.markFlagged(id, false);
      }

      if (cells[id].type === 0) {
        const [, row, column] = id.split('_').map((num) => parseInt(num, 10));
        for (let i = row - 1; i <= row + 1; i += 1) {
          for (let j = column - 1; j <= column + 1; j += 1) {
            if (i >= 0 && i < rowsCount && j >= 0 && j < rowsCount) {
              const lookingID = `cell_${i}_${j}`;
              if (!(cells[lookingID] === undefined) && !(i === row && j === column)) {
                if (cells[lookingID].type !== 'm') {
                  this.openCell(lookingID);
                }
              }
            }
          }
        }
      }

      if (!afterFinish) {
        if (cells[id].type === 'm') {
          cells[id].exploded = 1;
          cell.classList.add('cell_exploded');
          Minesweeper.setSavedState(cells);
          this.finishGame();
        }

        const won = Minesweeper.checkIfWon(cells);
        if (won) this.finishGame(won);
      }
    }
  }

  /**
   * Check if user won the game.
   * @param {*} cells
   * @returns
   */
  static checkIfWon(cells) {
    return Object.values(cells).filter((el) => el.type !== 'm').every((el) => el.opened === 1);
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
