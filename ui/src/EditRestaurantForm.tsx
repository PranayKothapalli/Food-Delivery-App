import { useState } from 'react';

type Restaurant = {
    id: number;
    name: string;
    rating: number;
    location?: string;
    establishedDate?: string;
};

// Define the props for our component
type EditFormProps = {
    initialData: Restaurant;
    onSave: (updatedRestaurant: Restaurant) => void;
    onCancel: () => void;
};

export function EditRestaurantForm({ initialData, onSave, onCancel }: EditFormProps) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const rating = Number(formData.rating);
        if (rating < 0 || rating > 5) {
            alert('Rating must be between 0 and 5.');
            return; // Stop the function here
        }
        onSave({ ...formData, rating: rating });
    };   

    return (
        <form onSubmit={handleSave}>
            <h2>Edit {initialData.name}</h2>
            <div>
                <label>Name: </label>
                <input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Rating: </label>    
                <input name="rating" type="number" value={formData.rating} onChange={handleChange} min="0" max="5" />
            </div>
            <div>
                <label>Location: </label>
                <input name="location" value={formData.location || ''} onChange={handleChange} />
            </div>
            <div>
                <label>Established Date: </label>
                <input
                    name="establishedDate"
                    type="date"
                    value={formData.establishedDate ? formData.establishedDate.split('T')[0] : ''}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">Save Changes</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}