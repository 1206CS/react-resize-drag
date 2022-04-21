import { combineReducers } from "redux";
import resizeAndDragReducer from './resizeAndDrag'

export default combineReducers({
  rnd: resizeAndDragReducer
})