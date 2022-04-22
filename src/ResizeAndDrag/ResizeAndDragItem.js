import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import {
  DRAG_GRID_X,
  DRAG_GRID_Y,
  ITEM_HEIGHT,
  ITEM_TYPE,
  ITEM_WIDTH,
} from "./constans";
import "./resizeItem.css";
import {
  selectors,
  updateItemPosition,
  updateSwapedItem,
} from "../store/resizeAndDrag";

import {
  calItemXAndWidthAfterResize,
  getCanResize,
  getDragStopItemInfo,
} from "./utils";

let resizingItem = {};
let draggingItem = {};
const itemColorMap = {
  bgColor: {
    [ITEM_TYPE.NORMAL]: "#f27d29",
    [ITEM_TYPE.DISABLED]: "lightgray",
    [ITEM_TYPE.NEW]: "#02ab02",
  },

  borderColor: {
    [ITEM_TYPE.NORMAL]: "#e53e3e",
    [ITEM_TYPE.DISABLED]: "#bdbdbd",
    [ITEM_TYPE.NEW]: "#089508",
  },
};
function ResizeAndDragItem({ details }) {
  const isDisabledItem = details.type === ITEM_TYPE.DISABLED;
  const dispatch = useDispatch();
  const itemList = useSelector(selectors.getItemList);

  const rndRef = useRef(null);
  const [itemX, setItemX] = useState(details.x);
  const [itemY, setItemY] = useState(details.y);
  const [itemWidth, setItemWidth] = useState(details.width);
  const [isResizing, setIsResizing] = useState(false);

  const handleDragStop = (newPosition) => {
    if (isResizing || (newPosition.x === itemX && newPosition.y === itemY)) {
      return;
    }
    const { canSwap, canDragInSameRow, newPositionItems } = getDragStopItemInfo(
      itemList,
      newPosition,
      itemWidth,
      { x: itemX, y: itemY }
    );

    if (canSwap || canDragInSameRow) {
      setItemX(newPosition.x);
      setItemY(newPosition.y);
      dispatch(
        updateItemPosition({
          x: newPosition.x,
          y: newPosition.y,
          id: details.id,
          width: itemWidth,
        })
      );

      if (canSwap) {
        dispatch(
          updateSwapedItem({
            x: draggingItem.x,
            y: draggingItem.y,
            id: newPositionItems[0].id,
          })
        );
      }
    }
  };

  const handleResizeStop = (itemX, direction, delta) => {
    const { newWidth, newX } = calItemXAndWidthAfterResize(
      itemWidth,
      itemX,
      delta
    );

    if (newWidth === itemWidth && newX === itemX) {
      rndRef?.current.updatePosition({ x: itemX, y: itemY });
      return;
    }

    const itemNewX = direction === "left" ? newX : itemX;
    const canResize = getCanResize(
      itemList,
      { x: itemX, y: itemY },
      itemNewX,
      newWidth
    );

    if (canResize) {
      if (direction === "left") {
        setItemX(itemNewX);
        rndRef?.current.updatePosition({ x: newX, y: itemY });
      }

      setItemWidth(newWidth);
      dispatch(
        updateItemPosition({
          x: itemNewX,
          y: itemY,
          id: details.id,
          width: newWidth,
        })
      );
    } else if (direction === "left") {
      rndRef?.current.updatePosition({ x: itemX, y: itemY });
    }
  };

  useEffect(() => {
    setItemWidth(details.width);
    setItemX(details.x);
    setItemY(details.y);
  }, [details.width, details.x, details.y]);

  return (
    <Rnd
      ref={rndRef}
      position={{ x: itemX, y: itemY }}
      size={{ width: itemWidth, height: ITEM_HEIGHT }}
      bounds="#dragWrap"
      dragGrid={[DRAG_GRID_X, DRAG_GRID_Y]}
      minWidth={ITEM_WIDTH}
      resizeGrid={[1, 1]}
      enableResizing={{
        left: !isDisabledItem,
        right: !isDisabledItem,
      }}
      disableDragging={isDisabledItem}
      className="dragItemWarp"
      onResizeStart={() => {
        // On tablet, resize will call OnDrag function, So need to save the original item x and set flag
        setIsResizing(true);
        resizingItem = { x: details.x };
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        handleResizeStop(resizingItem.x, direction, delta);
        setIsResizing(false);
      }}
      onDragStart={() => {
        draggingItem = { x: details.x, y: details.y };
      }}
      onDragStop={(e, d) => {
        handleDragStop({ x: d.lastX, y: d.lastY });
      }}
    >
      <div
        className="dragItem"
        style={{
          backgroundColor: itemColorMap.bgColor[details.type],
          borderColor: itemColorMap.borderColor[details.type],
        }}
      >
        Hello
      </div>
    </Rnd>
  );
}

export default ResizeAndDragItem;
