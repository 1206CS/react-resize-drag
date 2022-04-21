import {
  DRAG_GRID_X,
  DRAG_GRID_Y,
  ITEM_HEIGHT,
  ITEM_SPACING_X,
  ITEM_SPACING_Y,
  ITEM_TYPE,
  ITEM_WIDTH,
  RESIZR_GRID_MIDDLE,
} from "./constans";

export function createGridColumns(rowNum) {
  let results = [];
  for (let i = 0; i < rowNum; i++) {
    results.push({ x: i * (ITEM_WIDTH + ITEM_SPACING_X) });
  }
  return results;
}

export function createGridRows(colNum) {
  let results = [];
  for (let i = 0; i < colNum; i++) {
    results.push({ y: i * (ITEM_HEIGHT + ITEM_SPACING_Y) });
  }
  return results;
}

export function mockInitDragItems() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    items.push({
      x: i * DRAG_GRID_X,
      y: i * DRAG_GRID_Y,
      width: i === 0 ? ITEM_WIDTH : i * DRAG_GRID_X - ITEM_SPACING_X,
      id: i,
      type: i === 1 ? ITEM_TYPE.DISABLED : ITEM_TYPE.NORMAL,
    });
  }
  return items;
}

export function calItemXAndWidthAfterResize(itemWidth, itemX, delta) {
  let newWidth = itemWidth;
  let newX = itemX;
  const count = Math.floor(delta.width / DRAG_GRID_X);
  const restCount = Math.abs(delta.width % DRAG_GRID_X);

  const autoAlignToMidPrevItem =
    restCount === 0 ||
    (restCount < RESIZR_GRID_MIDDLE && count >= 0) ||
    (restCount >= RESIZR_GRID_MIDDLE && count < 0);

  if (autoAlignToMidPrevItem) {
    newWidth = itemWidth + count * DRAG_GRID_X;
    newX = itemX - count * DRAG_GRID_X;
  } else {
    newWidth = itemWidth + (count + 1) * DRAG_GRID_X;
    newX = itemX - (count + 1) * DRAG_GRID_X;
  }

  return { newWidth, newX };
}
