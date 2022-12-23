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
        // this.getTile();
        // console.log(this.tile);
        item.reset();
        item.classList.remove('active');
      }),
    );

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
          previousEl.classList.contains('tile') &&
          currentEl.classList.contains('input-text')
        ) &&
        !(
          previousEl.classList.contains('tile') &&
          currentEl.classList.contains('delete-btn')
        )
      ) {
        const tileEl = event.target;
        const delBtn = tileEl.querySelector('.delete-btn');
        delBtn.classList.add('hidden');
      }
    });

    this.dndUi.tilesContainerEl.addEventListener('mousedown', (event) => {
      const targetTile = event.target;

      // if (targetTile.closest('.tile')) {
      //   this.startDrag(event);
      // }

      if (targetTile.closest('.delete-btn')) {
        DndUi.deleteTile(targetTile);
      }
    });
    this.startDrag();
  }
  //// ================================================================================= ////
  startDrag() {
    // this.draggables = document.querySelectorAll('.draggable');
    // this.container = document.querySelectorAll('.container');
    // // console.log(this.container);
    // // console.log(this.draggables);
    // this.draggables.forEach((draggable) => {
    //   draggable.addEventListener('dragstart', () => {
    //     draggable.classList.add('dragging');
    //   });
    // });

    // this.draggables.forEach((draggable) => {
    //   draggable.addEventListener('dragend', () => {
    //     draggable.classList.remove('dragging');
    //   });
    // });

    // this.container.forEach((container) => {
    //   container.addEventListener('dragover', (event) => {
    //     event.preventDefault();
    //     const afterElement = this.getDragAfterElement(container, event.clientY);
    //     const draggable = document.querySelector('.dragging');
    //     if (afterElement == null) {
    //       container.appendChild(draggable);
    //     } else {
    //       container.insertBefore(draggable, afterElement);
    //     }
    //   });
    // });

    console.log(this.tile);
    setTimeout(() => {
      this.tile = document.querySelectorAll('.tile');
      console.log(this.tile);

      this.tile.forEach((tile) => {
        tile.addEventListener('dragstart', () => {
          tile.classList.add('dragging');
        });
        tile.addEventListener('dragend', () => {
          tile.classList.remove('dragging');
        });
      });

      this.tilesColumns = document.querySelectorAll('.tiles');

      function getDragAfterElement(container, y) {
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

      this.tilesColumns.forEach((tileColumn) => {
        tileColumn.addEventListener('dragover', (event) => {
          event.preventDefault();
          const afterTile = getDragAfterElement(tileColumn, event.clientY);
          const itemDraggable = document.querySelector('.dragging');
          if (afterTile == null) {
            tileColumn.appendChild(itemDraggable);
          } else {
            tileColumn.insertBefore(itemDraggable, afterTile);
          }
        });
      });
    }, 100);

    // this.tile.forEach((tile) => {
    //   tile.addEventListener('dragstart', () => {
    //     tile.classList.add('dragging');
    //   });
    //   tile.addEventListener('dragend', () => {
    //     tile.classList.remove('dragging');
    //   });
    // });

    // this.tilesColumns = document.querySelectorAll('.tiles');

    // function getDragAfterElement(container, y) {
    //   const draggableElements = [
    //     ...container.querySelectorAll('.draggable:not(.dragging)'),
    //   ];
    //   return draggableElements.reduce(
    //     (closest, child) => {
    //       const box = child.getBoundingClientRect();
    //       const offset = y - box.top - box.height / 2;

    //       if (offset < 0 && offset > closest.offset) {
    //         return { offset: offset, element: child };
    //       } else {
    //         return closest;
    //       }
    //     },
    //     { offset: Number.NEGATIVE_INFINITY },
    //   ).element;
    // }

    // this.tilesColumns.forEach((tileColumn) => {
    //   tileColumn.addEventListener('dragover', (event) => {
    //     event.preventDefault();
    //     // const itemDraggable = document.querySelector('.dragging');
    //     // console.log(tileColumn);
    //     // tileColumn.appendChild(itemDraggable);

    //     const afterTile = getDragAfterElement(tileColumn, event.clientY);
    //     const itemDraggable = document.querySelector('.dragging');
    //     if (afterTile == null) {
    //       tileColumn.appendChild(itemDraggable);
    //     } else {
    //       tileColumn.insertBefore(itemDraggable, afterTile);
    //     }
    //   });
    // });
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

  async getTile() {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve((this.tile = document.querySelectorAll('.tile')));
      }, 100);
    });
    this.tile = await promise;
    return this.tile;
  }
}
