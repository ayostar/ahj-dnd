import DndUi from './dnd.ui';
import cursors from './cursors';

export default class DndController {
  constructor(dndUi, stateService) {
    this.dndUi = dndUi;
    this.stateService = stateService;
    this.shiftX = null;
    this.shiftY = null;
    this.dragEl = null;
    this.cloneEl = null;
    this.emptyEl = null;
    this.toDo = null;
    this.inProgress = null;
    this.done = null;
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.toDo = document.getElementById('todo').querySelector('.tiles');
      this.inProgress = document
        .getElementById('in-progress')
        .querySelector('.tiles');
      this.done = document.getElementById('done').querySelector('.tiles');
      this.load();
    });
    window.addEventListener('unload', () => this.save());

    this.dndUi.checkBinding();
    this.dndUi.drawUi();

    this.dndUi.addTiles.forEach((elem) => {
      elem.addEventListener('click', (event) => {
        event.preventDefault();

        for (const form of this.dndUi.forms) {
          if (form.classList.contains('active')) {
            form.classList.remove('active');
          }
        }

        const target = event.target.parentElement.querySelector('.new-tile-form');
        target.classList.add('active');
        target.scrollIntoView(false);
      });
    });

    Array.from(this.dndUi.cancelBtns).forEach((elem) => {
      elem.addEventListener('click', (event) => {
        event.preventDefault();

        for (const form of this.dndUi.forms) {
          if (form.classList.contains('active')) {
            form.classList.remove('active');
            form.reset();
          }
        }
      });
    });

    this.dndUi.forms.forEach((item) => item.addEventListener('submit', (event) => {
      event.preventDefault();

      const input = [...item.elements][0];
      input.focus();
      const tilesCol = item.closest('.tiles-col');
      const column = tilesCol.children[1];
      DndUi.createTile(column, input.value);
      item.reset();
      item.classList.remove('active');
    }));
    this.dndUi.tilesContainerEl.addEventListener('mouseover', (event) => {
      event.preventDefault();

      const tile = event.target.classList.contains('tile');
      if (!tile) {
        return;
      }
      const tileEl = event.target;
      const delBtn = tileEl.querySelector('.delete-btn');
      delBtn.classList.remove('hidden');
    });

    this.dndUi.tilesContainerEl.addEventListener('mouseout', (event) => {
      event.preventDefault();

      const tile = event.target.classList.contains('tile');
      if (!tile) {
        return;
      }
      const previousEl = event.target;
      const currentEl = event.relatedTarget;
      if (
        !(
          previousEl.classList.contains('tile')
          && currentEl.classList.contains('input-text')
        )
        && !(
          previousEl.classList.contains('tile')
          && currentEl.classList.contains('delete-btn')
        )
      ) {
        const tileEl = event.target;
        const delBtn = tileEl.querySelector('.delete-btn');
        delBtn.classList.add('hidden');
      }
    });

    this.dndUi.tilesContainerEl.addEventListener('mousedown', (event) => {
      const targetTile = event.target;

      if (targetTile.closest('.tile')) {
        this.startDrag(event);
      }

      if (targetTile.closest('.delete-btn')) {
        DndUi.deleteTile(targetTile);
      }
    });

    document.addEventListener('mousemove', (event) => {
      this.moveAt(event);
    });
    document.addEventListener('mouseup', (event) => {
      this.finishDrag(event);
    });
  }

  save() {
    const data = {
      todo: [],
      inProgress: [],
      done: [],
    };
    const toDoTiles = this.toDo.querySelectorAll('.tile');
    const inProgressTiles = this.inProgress.querySelectorAll('.tile');
    const doneTiles = this.done.querySelectorAll('.tile');

    toDoTiles.forEach((item) => {
      data.todo.push(item.firstChild.textContent);
    });
    inProgressTiles.forEach((item) => {
      data.inProgress.push(item.firstChild.textContent);
    });
    doneTiles.forEach((item) => {
      data.done.push(item.firstChild.textContent);
    });

    this.stateService.save(data);
  }

  load() {
    const data = this.stateService.load();

    if (data) {
      data.todo.forEach((item) => {
        DndUi.createTile(this.toDo, item);
      });
      data.inProgress.forEach((item) => {
        DndUi.createTile(this.inProgress, item);
      });
      data.done.forEach((item) => {
        DndUi.createTile(this.done, item);
      });
    }
  }

  startDrag(event) {
    const targetTile = event.target.closest('.tile');
    if (!targetTile || event.target.classList.contains('delete-btn')) {
      return;
    }
    event.preventDefault();

    document.body.style.cursor = cursors.noDrag;
    this.dndUi.addTiles.forEach((elem) => {
      const tempElem = elem;
      tempElem.style.cursor = cursors.noDrag;
    });
    this.dndUi.tiles.forEach((elem) => {
      const tempElem = elem;
      tempElem.style.cursor = cursors.drag;
    });

    this.dragEl = targetTile;
    this.cloneEl = this.dragEl.cloneNode(true);
    this.emptyEl = this.dragEl.cloneNode(true);
    this.emptyEl.classList = '';
    this.emptyEl.textContent = '';

    this.shiftX = event.clientX - this.dragEl.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.dragEl.getBoundingClientRect().top;

    this.cloneEl.style.width = `${this.dragEl.offsetWidth}px`;
    this.cloneEl.style.height = `${this.dragEl.offsetHeight}px`;
    this.emptyEl.style.width = `${this.dragEl.offsetWidth}px`;
    this.emptyEl.style.height = `${this.dragEl.offsetHeight}px`;

    this.cloneEl.classList.add('dragged');
    this.dragEl.classList.add('hidden');
    this.emptyEl.classList.add('empty-tile');
    document.body.append(this.cloneEl);

    this.cloneEl.style.left = `${event.clientX - this.shiftX}px`;
    this.cloneEl.style.top = `${event.clientY - this.shiftY}px`;
    this.emptyEl.style.left = `${event.clientX - this.shiftX}px`;
    this.emptyEl.style.top = `${event.clientY - this.shiftY}px`;
  }

  moveAt(event) {
    event.preventDefault();
    if (!this.cloneEl) {
      return;
    }
    const targetTile = event.target.closest('.tile');
    if (!targetTile) {
      return;
    }
    targetTile.parentNode.insertBefore(
      this.emptyEl,
      targetTile.nextElementSibling,
    );

    let newX = event.clientX - this.shiftX;
    let newY = event.clientY - this.shiftY;

    const newBottom = newY + this.cloneEl.offsetHeight;

    if (newBottom > document.documentElement.clientHeight) {
      const docBottom = document.documentElement.getBoundingClientRect().bottom;
      let scrollY = Math.min(docBottom - newBottom, 10);

      if (scrollY < 0) scrollY = 0;

      window.scrollBy(0, scrollY);

      newY = Math.min(
        newY,
        document.documentElement.clientHeight - this.cloneEl.offsetHeight,
      );
    }

    if (newY < 0) {
      let scrollY = Math.min(-newY, 10);
      if (scrollY < 0) scrollY = 0;

      window.scrollBy(0, -scrollY);

      newY = Math.max(newY, 0);
    }

    if (newX < 0) newX = 0;
    if (
      newX
      > document.documentElement.clientWidth - this.cloneEl.offsetWidth
    ) {
      newX = document.documentElement.clientWidth - this.cloneEl.offsetWidth;
    }

    this.cloneEl.style.left = `${newX}px`;
    this.cloneEl.style.top = `${newY}px`;
    this.emptyEl.style.left = `${newX}px`;
    this.emptyEl.style.top = `${newY}px`;
  }

  finishDrag(event) {
    if (!this.dragEl) {
      return;
    }
    const targetPos = document.elementFromPoint(event.clientX, event.clientY);

    if (!targetPos) {
      this.endingDrag();
      return;
    }

    const targetTiles = targetPos.closest('.tiles');

    if (targetTiles === null) {
      this.dragEl.parentElement.append(this.dragEl);
    } else if (targetTiles && targetTiles === targetPos) {
      targetTiles.append(this.dragEl);
    } else if (targetTiles && targetTiles !== targetPos) {
      const tile = targetPos.closest('.tile');
      tile.after(this.dragEl);
    }
    this.endingDrag();
  }

  endingDrag() {
    document.body.style.cursor = cursors.auto;
    this.dndUi.addTiles.forEach((elem) => {
      const tempElem = elem;
      tempElem.style.cursor = '';
    });
    this.dndUi.tiles.forEach((elem) => {
      const tempElem = elem;
      tempElem.style.cursor = cursors.auto;
    });
    this.cloneEl.remove();
    this.emptyEl.remove();
    this.dragEl.classList.remove('hidden');
    this.dragEl = null;
    this.cloneEl = null;
    this.emptyEl = null;
  }
}
