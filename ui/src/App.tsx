import { useEffect, useState } from 'react'
import { EditRestaurantForm } from './EditRestaurantForm';

import './App.css'

// Define a type for our restaurant data
type Restaurant = {
    id: number;
    name: string;
    rating: number;
    location?: string;
    establishedDate?: string;
};

function App() {
    // Create a state variable to hold our restaurants
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [newName, setNewName] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [newLocation, setNewLocation] = useState('');
    const [newEstablishedDate, setNewEstablishedDate] = useState('');
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the browser from reloading

        const newRestaurant = {
            name: newName,
            rating: newRating,
            location: newLocation,
            establishedDate: newEstablishedDate,
        };

        try {
            const response = await fetch('http://localhost:5177/restaurants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRestaurant),
            });

            if (response.ok) {
                const savedRestaurant = await response.json();
                // Add the new restaurant to our list in the UI
                setRestaurants([...restaurants, savedRestaurant]);
                // Clear the form inputs
                setNewName('');
                setNewRating(0);
                setNewLocation('');
                setNewEstablishedDate('');
            }
        } catch (error) {
            console.error('Failed to create restaurant:', error);
        }
    };

    useEffect(() => {
        // This is an async function to allow us to use 'await'
        const fetchRestaurants = async () => {
            try {
                // Fetch data from your running C# API
                const response = await fetch('http://localhost:5177/restaurants');
                const data = await response.json();
                setRestaurants(data); // Update state with the fetched data
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            }
        };

        fetchRestaurants();
    }, []);

    const handleUpdateRestaurant = async (updatedRestaurant: Restaurant) => {
        try {
            // Use a PUT request to update the data
            const response = await fetch(`http://localhost:5177/restaurants/${updatedRestaurant.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRestaurant),
            });

            if (response.ok) {
                // Update the list in the UI
                setRestaurants(restaurants.map(r =>
                    r.id === updatedRestaurant.id ? updatedRestaurant : r
                ));
                // Go back to the main list view
                setEditingRestaurant(null);
            }
        } catch (error) {
            console.error('Failed to update restaurant:', error);
        }
    };

    return (
        <div>
            {editingRestaurant ? (
                // IF TRUE: Show the edit form
                <EditRestaurantForm
                    initialData={editingRestaurant}
                    onSave={handleUpdateRestaurant}
                    onCancel={() => setEditingRestaurant(null)}
                />
            ) : (
                // ELSE: Show the original view
                <>
                    <h1>Restaurants</h1>
                    <form
                        onSubmit={handleSubmit}>
                        <h2>Add a New Restaurant</h2>
                        <div>
                            <label>Name: </label>
                            <input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Rating: </label>
                            <input type="number"
                                value={newRating}
                                onChange={e => setNewRating(parseInt(e.target.value, 10))}
                            />
                        </div>
                        <div>
                            <label>Location: </label>
                            <input
                                value={newLocation}
                                onChange={e => setNewLocation(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Established Date: </label>
                            <input
                                type="date"
                                value={newEstablishedDate}
                                onChange={e => setNewEstablishedDate(e.target.value)}
                            />
                        </div>
                        <button type="submit">Add Restaurant</button>
                    </form>

                    <hr />

                    <ul>
                        {restaurants.map(restaurant => (
                            <li key={restaurant.id}>
                                {restaurant.name} - Rating: {restaurant.rating}/5
                                {restaurant.location && <div><em>Location: {restaurant.location}</em></div>}
                                {restaurant.establishedDate && <div><em>Established: {new Date(restaurant.establishedDate).toLocaleDateString()}</em></div>}
                                <button onClick={() => setEditingRestaurant(restaurant)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default App;
