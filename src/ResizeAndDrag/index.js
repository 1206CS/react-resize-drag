import { createGridColumns, createGridRows, mockInitDragItems } from "./utils";
import styles from "./index.module.scss";
import {
  DRAG_GRID_X,
  DRAG_GRID_Y,
  ITEM_SPACING_X,
  ITEM_SPACING_Y,
} from "./constans";
import ResizeAndDragList from "./ResizeAndDragList";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setItemList } from "../store/resizeAndDrag";

const rowNum = 8;
const colNum = 10;
const rows = createGridRows(rowNum);
const columns = createGridColumns(colNum);

const wrapWidth = colNum * DRAG_GRID_X - ITEM_SPACING_X;
const wrapHeight = rowNum * DRAG_GRID_Y - ITEM_SPACING_Y;

function ResizeAndDrag() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const itemList = mockInitDragItems();
    dispatch(setItemList(itemList));
  }, [dispatch]);

  return (
    <div
      id="dragWrap"
      style={{ position: "relative", width: wrapWidth, height: wrapHeight }}
    >
      {rows.map((row) => (
        <div key={row.y} style={{ marginBottom: ITEM_SPACING_Y }}>
          {columns.map((col) => (
            <button key={col.x} className={styles.gridButton}>
              H
            </button>
          ))}
        </div>
      ))}

      <ResizeAndDragList />
    </div>
  );
}

export default ResizeAndDrag;
