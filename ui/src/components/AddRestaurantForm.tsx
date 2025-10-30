import { useState } from 'react';
import type { NewRestaurant } from '../types';

// Define the initial empty state for the form
const INITIAL_FORM_STATE: NewRestaurant = {
    name: '',
    rating: 0,
    location: '',
    establishedDate: '',
};

type AddRestaurantFormProps = {
    onAdd: (restaurant: NewRestaurant) => Promise<void>;
};

export function AddRestaurantForm({ onAdd }: AddRestaurantFormProps) {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    // A single handler to update any form field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the browser from reloading

        if (formData.rating < 0 || formData.rating > 5) {
            alert('Rating must be between 0 and 5.');
            return;
        }

        try {
            await onAdd(formData);
            setFormData(INITIAL_FORM_STATE);
        } catch (error) {
            console.error('Failed to create restaurant:', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Add a New Restaurant</h2>
                <div>
                    <label>Name: </label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Rating: </label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                    />
                </div>
                <div>
                    <label>Location: </label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Established Date: </label>
                    <input
                        type="date"
                        name="establishedDate"
                        value={formData.establishedDate || ''}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Restaurant</button>
            </form>
        </div>
    );
}