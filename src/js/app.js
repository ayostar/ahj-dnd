import DndUi from './dnd.ui';
import { todoMap } from './utils';
import StateService from './state.service';
import DndController from './dnd.controller';

const dndContainer = document.querySelector('.dnd-container');

const dndUi = new DndUi(todoMap);
dndUi.bindToDOM(dndContainer);

const stateService = new StateService(localStorage);
const dndCtrl = new DndController(dndUi, stateService);

dndCtrl.init();
