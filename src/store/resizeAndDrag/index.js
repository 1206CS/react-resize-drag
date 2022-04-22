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
    addNewItem(state, { payload }) {
      const index = state.itemList.findIndex((item) => item.id === payload.id);
      if (index < 0) {
        state.itemList.push(payload);
      } else {
        state.itemList[index] = Object.assign({}, payload);
      }
    },
    updateSwapedItem(state, { payload }) {
      const index = state.itemList.findIndex((item) => item.id === payload.id);

      state.itemList[index] = Object.assign(state.itemList[index], {
        x: payload.x,
        y: payload.y,
      });
    },
  },
});

const getRndState = (state) => state.rnd;

const getItemList = createSelector(getRndState, (state) => state.itemList);

const selectors = {
  getItemList,
};

const { reducer } = resizeAndDragSlice;
export { selectors };
export const {
  setItemList,
  updateItemPosition,
  setCurrentItem,
  addNewItem,
  updateSwapedItem,
} = resizeAndDragSlice.actions;
export default reducer;
