import type { Restaurant } from '../types';
import { RestaurantListItem } from './RestaurantListItem';

type RestaurantListProps = {
    restaurants: Restaurant[];
    onEdit: (restaurant: Restaurant) => void;
    onDelete: (id: number) => Promise<void>;
};

export function RestaurantList({
    restaurants,
    onEdit,
    onDelete,
}: RestaurantListProps) {
    return (
        <div className="list-container">
            <ul>
                {restaurants.map((restaurant) => (
                    <RestaurantListItem
                        key={restaurant.id}
                        restaurant={restaurant}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
}