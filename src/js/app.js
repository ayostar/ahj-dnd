import DndUi from './dnd.ui';
import todoMap from './utils';
import StateService from './state.service';
import DndController from './dnd.controller';
import DragThis from './dragthis';

const dndContainer = document.querySelector('.dnd-container');

const dndUi = new DndUi(todoMap);
dndUi.bindToDOM(dndContainer);

const stateService = new StateService(localStorage);
const dndCtrl = new DndController(dndUi, stateService);

// const items = document.querySelectorAll('.item');
// // Считываем все боксы в массив
// const boxes = Array.from(document.querySelectorAll('.box'));

// const dragThis = new DragThis(items, boxes);
// dragThis.dragInit();

dndCtrl.init();
