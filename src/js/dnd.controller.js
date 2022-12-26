import DndUi from './dnd.ui';
import cursors from './cursors';

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

        const target =
          event.target.parentElement.querySelector('.new-tile-form');
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

    this.dndUi.forms.forEach((item) =>
      item.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = [...item.elements][0];
        input.focus();
        const tilesCol = item.closest('.tiles-col');
        const column = tilesCol.children[1];
        DndUi.createTile(column, input.value);

        item.reset();
        item.classList.remove('active');
      }),
    );

    this.dndUi.tilesContainerEl.addEventListener('click', (event) => {
      const targetTile = event.target;

      if (targetTile.closest('.delete-btn')) {
        DndUi.deleteTile(targetTile);
      }
    });

    this.dragStart();
  }
  dragStart() {
    document.body.addEventListener('mouseover', (event) => {
      if (event.target.classList.contains('draggable')) {
        event.target.style.cursor = cursors.drag;
      } else if (event.target.classList.contains('tiles-container')) {
        event.target.style.cursor = cursors.noDrag;
      }
    });
    // tile.addEventListener('mouseover', (event) => {
    //   event.target.style.cursor = cursors.drag;
    //   console.log(event);
    // });
    document.body.addEventListener('mousedown', (event) => {
      if (!event.target.classList.contains('draggable')) return;

      const tile = event.target;

      tile.addEventListener('dragstart', () => {
        tile.classList.add('dragging');
      });

      tile.addEventListener('dragend', () => {
        tile.classList.remove('dragging');
        tile.classList.remove('drag-clone-hover');
      });

      this.tilesColumns = document.querySelectorAll('.tiles');

      this.tilesColumns.forEach((tileColumn) => {
        // tileColumn.addEventListener('mouseleave', (event) => {
        //   event.target.style.cursor = cursors.noDrag;
        //   console.log(event);
        // });

        // tileColumn.addEventListener('mouseenter', (event) => {
        //   event.target.style.cursor = cursors.drag;
        //   console.log(event);
        // });

        tileColumn.addEventListener('dragenter', (event) => {
          event.preventDefault();
          const itemDraggable = document.querySelector('.dragging');
          itemDraggable.classList.add('drag-clone-hover');
          event.target.style.cursor = cursors.drag;
        });

        tileColumn.addEventListener('dragleave', (event) => {
          const itemDraggable = document.querySelector('.dragging');
          itemDraggable.style.cursor = cursors.noDrag;
        });

        tileColumn.addEventListener('dragover', (event) => {
          // event.target.style.cursor = cursors.drag;

          event.preventDefault();

          const afterTile = this.getDragAfterElement(tileColumn, event.clientY);
          const itemDraggable = document.querySelector('.dragging');
          if (afterTile == null) {
            tileColumn.appendChild(itemDraggable);
          } else {
            tileColumn.insertBefore(itemDraggable, afterTile);
          }
        });
      });
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('.draggable:not(.dragging)'),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
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
}
