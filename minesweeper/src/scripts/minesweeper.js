export default class Minesweeper {
  init() {
    this.selectors = {
      main: 'minesweeper',
      mode: 'minesweeper__mode',
      minesCount: 'minesweeper__mines-count',
      field: 'minesweeper__field',
    };
    this.currentMode = 'junior';
    this.currentMinesCount = 10;
    this.body = document.querySelector('body');
    this.mainBlock = this.addMainBlock();
    [this.modeBlock, this.countBlock] = this.addSettingsBlock();
    this.gameFieldBlock = this.addGameFieldBlock();
  }

  addMainBlock() {
    const mainBlock = document.createElement('div');
    mainBlock.classList = this.selectors.main;
    this.body.appendChild(mainBlock);

    return mainBlock;
  }

  addSettingsBlock() {
    const modeBlock = document.createElement('div');
    const modes = ['junior', 'middle', 'senior'];
    const countBlock = document.createElement('div');
    const countInput = document.createElement('input');
    const countLabel = document.createElement('label');
    const rangeID = 'count';
    const rangeAttrs = {
      type: 'range',
      min: 10,
      max: 99,
      step: 1,
      id: rangeID,
      name: rangeID,
      value: this.currentMinesCount,
    };

    modeBlock.classList = this.selectors.mode;
    countBlock.classList = this.selectors.minesCount;
    countLabel.innerText = 'Mines count';
    countLabel.setAttribute('for', rangeID);
    Object.entries(rangeAttrs).forEach(([key, value]) => {
      countInput.setAttribute(key, value);
    });

    this.mainBlock.appendChild(modeBlock);
    countBlock.appendChild(countLabel);
    countBlock.appendChild(countInput);
    this.mainBlock.appendChild(countBlock);

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
      if (mode === this.currentMode) {
        input.checked = true;
      }
      label.setAttribute('for', inputID);
      label.innerText = mode;

      label.appendChild(input);
      modeBlock.appendChild(label);
    });

    return [modeBlock, countBlock];
  }

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

    this.body.appendChild(gameFieldBlock);

    return gameFieldBlock;
  }
}
