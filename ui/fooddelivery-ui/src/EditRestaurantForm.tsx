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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
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
                <input name="rating" type="number" value={formData.rating} onChange={handleChange} />
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