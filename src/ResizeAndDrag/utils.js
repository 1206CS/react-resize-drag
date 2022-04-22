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
import _ from "lodash";

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

export function getItemXs(itemWidth, itemX) {
  const itemCount = (itemWidth + ITEM_SPACING_X) / DRAG_GRID_X;
  const results = [];
  for (let i = 0; i < itemCount; i++) {
    results.push(itemX + i * DRAG_GRID_X);
  }
  return results;
}

export function getSameRowOtherItemXs(
  itemList,
  originPosition,
  isNotIncludeNewItem
) {
  const sameRowNewItems = [];

  itemList.forEach((item) => {
    if (item.y === originPosition.y && item.x !== originPosition.x) {
      const itemTypeCondition =
        (isNotIncludeNewItem && item.type !== ITEM_TYPE.NEW) ||
        !isNotIncludeNewItem;

      if (itemTypeCondition) {
        const itemXs = getItemXs(item.width, item.x);
        sameRowNewItems.push(...itemXs);
      }
    }
  });
  return sameRowNewItems;
}

export function getCanBeCombined(otherItemXs, prevX, behindX) {
  const middleItemIndex = otherItemXs.findIndex(
    (item) => item < behindX && item > prevX
  );
  return middleItemIndex === -1;
}

export function getNewItemInfo(itemList, x, y) {
  const newItem = {
    x,
    y,
    width: ITEM_WIDTH,
    id: itemList.length,
    type: ITEM_TYPE.NEW,
  };

  const sameRowNewItems = itemList.filter(
    (item) => item.type === ITEM_TYPE.NEW && item.y === y
  );

  const otherItemXs = getSameRowOtherItemXs(itemList, { x, y }, true);

  for (let i = 0; i < sameRowNewItems.length; i++) {
    const sameRowItem = sameRowNewItems[i];

    const prevItem = sameRowItem.x > x ? newItem : sameRowItem;
    const behindItem = sameRowItem.x > x ? sameRowItem : newItem;

    const canBeCombined = getCanBeCombined(
      otherItemXs,
      prevItem.x,
      behindItem.x
    );

    if (canBeCombined) {
      const width = behindItem.x - prevItem.x + behindItem.width;
      return Object.assign({}, sameRowItem, { x: prevItem.x, width });
    }
  }
  return newItem;
}

export function getCanResize(itemList, originalPosition, itemX, newWidth) {
  const otherItemXs = getSameRowOtherItemXs(itemList, originalPosition);
  const currentItemX = getItemXs(newWidth, itemX);

  const result = _.difference(otherItemXs, currentItemX);
  return result.length === otherItemXs.length;
}

export function getNewPositionItems(
  itemList,
  position,
  itemWidth,
  originPosition
) {
  const results = [];
  const currentItemX = getItemXs(itemWidth, position.x);
  itemList.forEach((item) => {
    if (item.y === position.y) {
      if (
        (item.y === originPosition.y && item.x !== originPosition.x) ||
        item.y !== originPosition.y
      ) {
        const itemXs = getItemXs(item.width, item.x);
        const diffResult = _.difference(itemXs, currentItemX);
        if (diffResult.length !== itemXs.length) {
          results.push(item);
        }
      }
    }
  });

  return results;
}

export function getDragStopItemInfo(
  itemList,
  newPosition,
  itemWidth,
  draggingItem
) {
  let canDragInSameRow = false;
  let canSwap = false;
  const newPositionItems = getNewPositionItems(
    itemList,
    newPosition,
    itemWidth,
    draggingItem
  );

  canDragInSameRow = newPositionItems.length === 0;

  //if only one item in new position and item type is not disabled
  if (
    newPositionItems.length === 1 &&
    newPositionItems[0].type !== ITEM_TYPE.DISABLED
  ) {
    let otherItemXs = getSameRowOtherItemXs(itemList, draggingItem);

    //if new position item in draggingItem Positio , getItemXs
    const swapedItemXs = getItemXs(newPositionItems[0].width, draggingItem.x);

    //if drag in the same row, should push new position to itemX
    if (newPosition.y === draggingItem.y) {
      const draggingItemXs = getItemXs(otherItemXs, newPosition.x);
      otherItemXs = otherItemXs.concat(draggingItemXs);
    }

    const diffResult = _.difference(otherItemXs, swapedItemXs);
    canSwap = diffResult.length === otherItemXs.length;
  }
  return { canDragInSameRow, canSwap, newPositionItems };
}
