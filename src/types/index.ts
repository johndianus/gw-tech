export type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
  details: {
    address: string;
    contactEmail: string;
    reviewScore: number;
    openingHours?: {
      weekday: string;
      weekend: string;
    };
  };
  };
  
  export interface SelectRestaurantAction {
    type: string;
    payload: Restaurant | null;
  }
  
  export type RestaurantActionTypes = SelectRestaurantAction;
