// export default class DragThis {
//   constructor(items, dropZones) {
//     this.items = items;
//     this.dropZones = document.querySelectorAll('.box');
//   }

//   dragInit() {
//     // Обработчик начала перетаскивания элемента
//     this.items.forEach((item) => {
//       item.addEventListener('dragstart', this.dragStart);
//       item.addEventListener('dragend', this.dragEnd);
//     });

//     this.dropZones.forEach((dropZone) => {
//       // Когда заходим элементом в бокс
//       dropZone.addEventListener('dragover', this.dragOver);
//       // Когда отпускаем элемент на нужном боксе
//       dropZone.addEventListener('drop', this.dragDrop);
//       // Когда достигаем бокс
//       dropZone.addEventListener('dragenter', this.dragEnter);
//       // Когда покидаем бокс
//       dropZone.addEventListener('dragleave', this.dragLeave);
//     });
//   }

//   // Функция начала перетаскивания элемента
//   dragStart(event) {
//     // Меняем цвет на фиолетовый
//     event.target.classList.add('item--hold');

//     // Удаляем элемент из бокса
//     setTimeout(() => event.target.classList.add('item--hide'), 0);
//   }

//   // Функция завершения перетаскивания элемента
//   dragEnd(event) {
//     // Меняем цвет на синий
//     event.target.classList.remove('item--hold');
//     // Возвращаем элемент обратно
//     event.target.classList.remove('item--hide');
//   }

//   dragOver(event) {
//     event.preventDefault();
//   }

//   dragDrop(event) {
//     // Добавляем наш элемент в нужный бокс
//     const item = document.querySelector('.item--hold');
//     event.target.append(item);
//     // Убираем желтую подсветку
//     event.target.classList.remove('box--hovered');
//   }

//   dragEnter(event) {
//     // Добавляем желтую подсветку
//     event.target.classList.add('box--hovered');
//   }

//   dragLeave(event) {
//     // Убираем желтую подсветку
//     event.target.classList.remove('box--hovered');
//   }

//   getDragAfterElement(container, y) {
//     const draggableElements = [
//       ...container.querySelectorAll('.item:not(.item--hold)'),
//     ];
//     return draggableElements.reduce(
//       (closest, child) => {
//         const box = child.getBoundingClientRect();
//         const offset = y - box.top - box.height / 2;

//         if (offset < 0 && offset > closest.offset) {
//           return { offset, element: child };
//         }
//         return closest;
//       },
//       { offset: Number.NEGATIVE_INFINITY },
//     ).element;
//   }
// }
