import { combineReducers } from "redux";
import { RestaurantActionTypes } from "../types";

const initialState = null;

const restaurantReducer = (state = initialState, action: RestaurantActionTypes) => {
  switch (action.type) {
    case "SELECT":
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  restaurant: restaurantReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
