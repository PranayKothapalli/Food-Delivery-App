import type { Restaurant } from '../types';

type RestaurantListItemProps = {
    restaurant: Restaurant;
    onEdit: (restaurant: Restaurant) => void;
    onDelete: (id: number) => Promise<void>;
};

export function RestaurantListItem({
    restaurant,
    onEdit,
    onDelete,
}: RestaurantListItemProps) {

    const handleDeleteClick = () => {
        const isConfirmed = window.confirm(
            'Are you sure you want to delete this restaurant?'
        );

        if (!isConfirmed) {
            return;
        }
        onDelete(restaurant.id);
    };

    // Helper to format the date string
    const getFormattedDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <li>
            {restaurant.name} - Rating: {restaurant.rating}/5
            {restaurant.location && <div><em>Location: {restaurant.location}</em></div>}
            {restaurant.establishedDate && (
                <div><em>Established: {getFormattedDate(restaurant.establishedDate)}</em></div>
            )}
            <div className="card-buttons">
                <button onClick={() => onEdit(restaurant)}>Edit</button>
                <button className="delete-button" onClick={handleDeleteClick}>
                    Delete
                </button>
            </div>
        </li>
    );
}