// class GrabContext {
//   static _grabbingItem = null;

//   static setGrabbing(element) {
//     GrabContext._grabbingItem = element;
//   }

//   static isHaveDragging() {
//     return !!GrabContext._grabbingItem;
//   }

//   static nullishGrabbing() {
//     GrabContext._grabbingItem = null;
//   }

//   static getGrabbingElement() {
//     return GrabContext._grabbingItem;
//   }
// }

// class Item {
//   constructor(node) {
//     this._elementNode = node;
//     this._elementWidth = this.getCoordinate().width;
//     this._elementHeight = this.getCoordinate().height;
//   }

//   setClass(className) {
//     this._elementNode.classList.add(className);
//   }

//   removeClass(className) {
//     this._elementNode.classList.remove(className);
//   }

//   getCoordinate() {
//     const { x, y, width, height } = this._elementNode.getBoundingClientRect();
//     return {
//       x,
//       y,
//       width,
//       height,
//     };
//   }

//   setStyleCoordinate(x, y) {
//     this._elementNode.style.left = `${x}px`;
//     this._elementNode.style.top = `${y}px`;
//   }

//   getCloneNode() {
//     return this._clone;
//   }
// }

// document.body.addEventListener('mousedown', (evt) => {
//   const target = evt.target;

//   if (target.classList.contains('whiteboard__item_draggable')) {
//     const { x, y } = evt;
//     GrabContext.setGrabbing(new Item(target));
//     const drag = GrabContext.getGrabbingElement();
//     drag.setClass('whiteboard__item_dragged');

//     const { height, width } = drag.getCoordinate();

//     let offsetLeft = x - width;
//     let offsetTop = y - height;
//     drag.setStyleCoordinate(offsetLeft, offsetTop);
//   }
// });

// document.body.addEventListener('mouseup', (evt) => {
//   if (GrabContext.isHaveDragging()) {
//     GrabContext.getGrabbingElement().removeClass('whiteboard__item_dragged');
//     GrabContext.nullishGrabbing();
//   }
// });

// document.body.addEventListener('mousemove', (evt) => {
//   if (GrabContext.isHaveDragging()) {
//     const { x, y } = evt;
//     const drag = GrabContext.getGrabbingElement();
//     const { height, width } = drag.getCoordinate();
//     let offsetLeft = x - width / 2;
//     let offsetTop = y - height;
//     drag.setStyleCoordinate(offsetLeft, offsetTop);
//   }
// });
