import DndUi from '../dnd.ui';

const dndContainer = 'not a container';

test('should throw error if not a container passed to draw UI', () => {
  const expected = 'HTMLElement is not defined';
  const dndUi = new DndUi();
  const received = () => dndUi.bindToDOM(dndContainer);
  expect(received).toThrow(expected);
});
