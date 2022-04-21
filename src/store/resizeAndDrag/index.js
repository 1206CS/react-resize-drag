import { createSelector, createSlice } from "@reduxjs/toolkit";

const resizeAndDragSlice = createSlice({
  name: "rnd",
  initialState: {
    itemList: [],
    currentItem: {},
  },
  reducers: {
    setItemList(state, { payload }) {
      state.itemList = payload;
    },

    setCurrentItem(state, { payload }) {
      state.currentItem = payload;
    },
    updateItemPosition(state, { payload }) {
      const itemIndex = state.itemList.findIndex(
        (item) => item.id === payload.id
      );
      state.itemList[itemIndex] = Object.assign(state.itemList[itemIndex], {
        x: payload.x,
        y: payload.y,
        width: payload.width,
      });
    },
    // updateItemPosition(state, { payload }) {
    //   const itemIndex = state.itemList.findIndex(
    //     (item) => item.id === state.currentItem.id
    //   );

    //   state.itemList[itemIndex] = Object.assign(state.itemList[itemIndex], {
    //     x: state.currentItem.x,
    //     y: state.currentItem.y,
    //     width: state.currentItem.width,
    //   });
  },
});

const getRndState = (state) => state.rnd;

const getItemList = createSelector(getRndState, (state) => state.itemList);

const selectors = {
  getItemList,
};

const { reducer } = resizeAndDragSlice;
export { selectors };
export const { setItemList, updateItemPosition, setCurrentItem } =
  resizeAndDragSlice.actions;
export default reducer;
