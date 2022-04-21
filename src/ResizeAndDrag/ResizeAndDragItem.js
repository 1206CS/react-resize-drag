import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import {
  DRAG_GRID_X,
  DRAG_GRID_Y,
  ITEM_HEIGHT,
  ITEM_TYPE,
  ITEM_WIDTH,
} from "./constans";
import "./resizeItem.css";
import { calItemXAndWidthAfterResize } from "./utils";

let resizingItem = {};

function ResizeAndDragItem({ details }) {
  const isDisabledItem = details.type === ITEM_TYPE.DISABLED;

  const rndRef = useRef(null);
  const [itemX, setItemX] = useState(details.x);
  const [itemY, setItemY] = useState(details.y);
  const [itemWidth, setItemWidth] = useState(details.width);

  const handleResizeStop = (direction, delta) => {
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
    const canResize = true; //()need a function 

    if (canResize) {
      if (direction === "left") {
        setItemX(itemNewX);
        rndRef?.current.updatePosition({ x: newX, y: itemY });
      }

      setItemWidth(newWidth);
    } else if (direction === "left") {
      rndRef?.current.updatePosition({ x: itemX, y: itemY });
    }
  };
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
        resizingItem = details;
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        handleResizeStop(direction, delta);
      }}
    >
      <div
        className="dragItem"
        style={{
          backgroundColor: isDisabledItem ? "lightgray" : "#f27d29",
          borderColor: isDisabledItem ? "#bdbdbd" : "#e53e3e",
        }}
      >
        Hello
      </div>
    </Rnd>
  );
}

export default ResizeAndDragItem;
