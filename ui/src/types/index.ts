// Define a type for our restaurant data
export type Restaurant = {
    id: number;
    name: string;
    rating: number;
    location?: string;
    establishedDate?: string;
};

export type NewRestaurant = Omit<Restaurant, 'id'>;