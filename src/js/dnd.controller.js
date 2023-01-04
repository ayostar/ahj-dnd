import DndUi from './dnd.ui';

export default class DndController {
  constructor(dndUi, stateService) {
    this.dndUi = dndUi;
    this.stateService = stateService;
    this.toDo = null;
    this.inProgress = null;
    this.done = null;
    this.tile = null;
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

    this.dndUi.tilesContainerEl.addEventListener('click', (event) => {
      const targetTile = event.target;

      if (targetTile.closest('.delete-btn')) {
        DndUi.deleteTile(targetTile);
      }
    });

    this.dragStart();
  }

  dragStart() {
    document.body.addEventListener('mousedown', (e) => {
      if (!e.target.classList.contains('draggable')) return;

      const tile = e.target;

      tile.addEventListener('dragstart', () => {
        tile.classList.add('dragging');
        console.log(`dragstart ${document.body.style.cursor}`);
      });

      tile.addEventListener('dragend', () => {
        tile.classList.remove('dragging');
        tile.classList.remove('drag-clone-hover');
        console.log(`dragend ${document.body.style.cursor}`);
      });

      this.tilesColumns = document.querySelectorAll('.tiles');

      this.tilesColumns.forEach((tileColumn) => {
        tileColumn.addEventListener('dragenter', (event) => {
          event.preventDefault();
          const itemDraggable = document.querySelector('.dragging');
          itemDraggable.classList.add('drag-clone-hover');
          console.log(`dragenter ${document.body.style.cursor}`);
        });

        tileColumn.addEventListener('dragleave', () => {
          console.log(`dragleave ${document.body.style.cursor}`);
        });

        tileColumn.addEventListener('dragover', (event) => {
          event.preventDefault();

          const afterTile = this.getDragAfterElement(tileColumn, event.clientY);
          const itemDraggable = document.querySelector('.dragging');

          if (afterTile == null) {
            tileColumn.appendChild(itemDraggable);
          } else {
            tileColumn.insertBefore(itemDraggable, afterTile);
          }

          console.log(`dragover ${document.body.style.cursor}`);
        });
      });
    });
  }
  /* eslint-disable */
  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('.draggable:not(.dragging)'),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }
  /* eslint-enable */

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
}
