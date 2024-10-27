
import { Restaurant, SelectRestaurantAction} from "../types";

export const selectRestaurant = (restaurant: Restaurant | null): SelectRestaurantAction => {
  return {
    type: "SELECT",
    payload: restaurant,
  };
};
