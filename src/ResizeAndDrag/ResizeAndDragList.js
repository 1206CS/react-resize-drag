import { useSelector } from "react-redux";
import { selectors } from "../store/resizeAndDrag";
import ResizeAndDragItem from "./ResizeAndDragItem";

function ResizeAndDragList() {
  const dragList = useSelector(selectors.getItemList);

  return (
    <>
      {dragList?.map((item) => (
        <ResizeAndDragItem key={item.id} details={item} />
      ))}
    </>
  );
}

export default ResizeAndDragList;
