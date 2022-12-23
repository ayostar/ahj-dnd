export default class DndUi {
  constructor(todoMap) {
    this.todoMap = todoMap;
    this.container = null;
    this.tilesContainerEl = null;
    this.addTiles = null;
    this.forms = null;
    this.cancelBtns = null;
    this.inputs = null;
    this.tiles = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Контейнер не "HTMLElement"');
    }
    this.container = container;
  }

  drawUi() {
    this.tilesContainerEl = document.createElement('div');
    this.tilesContainerEl.classList.add('tiles-container');
    this.container.append(this.tilesContainerEl);

    this.todoMap.forEach((item) => {
      const tilesColEl = document.createElement('div');
      tilesColEl.id = `${item.id}`;
      tilesColEl.classList.add('tiles-col');
      tilesColEl.innerHTML = `<p class="tile-title">${item.title}</p>\n<div class="tiles"></div>\n<div class="add-tile">+ Add another card</div>\n
        <form class="new-tile-form">\n<input type="text" class="tile-input" placeholder="Enter a title for this card..." required>\n
        <div class="button-container">\n<button class="add-btn" type="submit">Add card</button>\n<button class="cancel-btn">&#10005;</button>\n
        </div>\n</form>\n`;
      this.tilesContainerEl.append(tilesColEl);
    });

    this.addTiles = this.container.querySelectorAll('.add-tile');
    this.forms = this.container.querySelectorAll('.new-tile-form');
    this.cancelBtns = this.container.querySelectorAll('.cancel-btn');
    this.inputs = this.container.querySelectorAll('.tile-input');
    this.tiles = this.container.querySelectorAll('.tiles');
  }

  static createTile(column, value) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.classList.add('draggable');
    tile.draggable = true;
    tile.innerHTML = `<div class="input-text">${value}</div>\n<button class="delete-btn hidden">&#10005;</button>`;
    column.append(tile);
  }

  static deleteTile(event) {
    event.parentElement.remove();
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('Процесс не привязан к DOM');
    }
  }
}
