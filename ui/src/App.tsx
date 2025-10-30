import { useEffect, useState } from 'react';
import { EditRestaurantForm } from './components/EditRestaurantForm';
import { AddRestaurantForm } from './components/AddRestaurantForm';
import { RestaurantList } from './components/RestaurantList';
import type { Restaurant, NewRestaurant } from './types';

import './App.css';

// Define API base URL in one place
const API_BASE_URL = 'http://localhost:5177';

function App() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);


    // 1. Fetch all restaurants (READ)
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/restaurants`);
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };

        fetchRestaurants();
    }, []);

    // 2. Add a new restaurant (CREATE)
    const handleAddRestaurant = async (newRestaurant: NewRestaurant) => {
        try {
            const response = await fetch(`${API_BASE_URL}/restaurants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRestaurant),
            });

            if (response.ok) {
                const savedRestaurant = await response.json();
                setRestaurants([...restaurants, savedRestaurant]);
            }
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };

    // 3. Update an existing restaurant (UPDATE)
    const handleUpdateRestaurant = async (updatedRestaurant: Restaurant) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/restaurants/${updatedRestaurant.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedRestaurant),
                }
            );

            if (response.ok) {
                setRestaurants(
                    restaurants.map((r) =>
                        r.id === updatedRestaurant.id ? updatedRestaurant : r
                    )
                );
                setEditingRestaurant(null);
            }
        } catch (error) {
            console.error('Failed to update restaurant:', error);
        }
    };

    // 4. Delete a restaurant (DELETE)
    const handleDeleteRestaurant = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRestaurants(restaurants.filter((r) => r.id !== id));
            } else {
                console.error('Failed to delete restaurant from server.');
            }
        } catch (error) {
            console.error('Failed to delete restaurant:', error);
        }
    };


    return (
        <div className="App">
            {editingRestaurant ? (
                // IF TRUE: Show the edit form
                <EditRestaurantForm
                    initialData={editingRestaurant}
                    onSave={handleUpdateRestaurant}
                    onCancel={() => setEditingRestaurant(null)}
                />
            ) : (
                // ELSE: Show the main page (add form + list)
                <>
                    <h1>Restaurants</h1>
                    <div className="main-layout">
                        <AddRestaurantForm onAdd={handleAddRestaurant} />
                        <RestaurantList
                            restaurants={restaurants}
                            onEdit={setEditingRestaurant}
                            onDelete={handleDeleteRestaurant}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default App;