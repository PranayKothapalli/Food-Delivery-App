using FoodDeliveryApi.Data;
using FoodDeliveryApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Define CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // Allow requests from your React app's origin
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

//configure the DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<RestaurantDb>(options =>
    options.UseSqlServer(connectionString));

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();

//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// Use the CORS policy
app.UseCors("AllowReactApp");

// enable the Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// GET API endpoint to get all restaurants
app.MapGet("/restaurants", (RestaurantDb db) =>
{
    return db.Restaurants.Include(r => r.MenuItems).ToList();
});

// GET a single restaurant from the database
app.MapGet("/restaurants/{id}", (RestaurantDb db, int id) =>
{
    var restaurant = db.Restaurants
    .Include(r => r.MenuItems)
    .FirstOrDefault(r => r.Id == id);
    return restaurant != null ? Results.Ok(restaurant) : Results.NotFound();
});

// Endpoint to create (POST) a new restaurant
app.MapPost("/restaurants", (RestaurantDb db, Restaurant restaurant) =>
{
    db.Restaurants.Add(restaurant);
    db.SaveChanges();
    return Results.Created($"/restaurants/{restaurant.Id}", restaurant);
});

// PUT (update) a restaurant in the database
app.MapPut("/restaurants/{id}", (RestaurantDb db, int id, Restaurant updatedRestaurant) =>
{
    var restaurant = db.Restaurants.Find(id);

    if (restaurant is null) return Results.NotFound();

    restaurant.Name = updatedRestaurant.Name;
    restaurant.Rating = updatedRestaurant.Rating;
    restaurant.Location = updatedRestaurant.Location;
    restaurant.EstablishedDate = updatedRestaurant.EstablishedDate;

    db.SaveChanges(); // Writes the changes to the database

    return Results.NoContent();
});

// DELETE a restaurant from the database
app.MapDelete("/restaurants/{id}", (RestaurantDb db, int id) =>
{
    var restaurant = db.Restaurants.Find(id);

    if (restaurant is null) return Results.NotFound();

    db.Restaurants.Remove(restaurant);
    db.SaveChanges(); // Writes the deletion to the database

    return Results.NoContent();
});

//Api endpoints for MenuItems can be added similarly...
app.MapGet("/restaurants/{id}/menuItems", (RestaurantDb db, int id) =>
{
    // Get menu items for a specific restaurant
    var menuItems = db.MenuItems.Where(m => m.RestaurantId == id).ToList();
    return Results.Ok(menuItems);
});

app.MapPost("/restaurants/{id}/menuItems", (RestaurantDb db, int id, MenuItem menuItem) =>
{
    if (db.Restaurants.Find(id) is null)
    {
        return Results.NotFound();
    }
    //add a new menu item to a specific restaurant
    menuItem.RestaurantId = id;
    db.MenuItems.Add(menuItem);
    db.SaveChanges();
    return Results.Created($"/restaurants/{id}/menuitems/{menuItem.Id}", menuItem);
});

app.MapPut("/restaurants/{id}/menuItems/{menuItemId}", (RestaurantDb db, int id, int menuItemId, MenuItem updatedMenuItem) =>
{
    // Update a menu item for a specific restaurant
    var existingMenuItem = db.MenuItems.Find(menuItemId);
    if (existingMenuItem is null) return Results.NotFound();
    // Check if the item belongs to the correct restaurant
    if (existingMenuItem.RestaurantId != id) return Results.NotFound();

    existingMenuItem.Name = updatedMenuItem.Name;
    existingMenuItem.Description = updatedMenuItem.Description;
    existingMenuItem.Price = updatedMenuItem.Price;
    existingMenuItem.IsAvailable = updatedMenuItem.IsAvailable;
    existingMenuItem.RestaurantId = id;

    db.SaveChanges();
    return Results.NoContent();
});

app.MapDelete("restaurants/{id}/menuItems/{menuItemId}", (RestaurantDb db, int id, int menuItemId) =>
{
    // Delete a menu item from a specific restaurant
    var menuItem = db.MenuItems.Find(menuItemId);

    if (menuItem is null) return Results.NotFound();
    if (menuItem.RestaurantId != id) return Results.NotFound();

    db.MenuItems.Remove(menuItem);
    db.SaveChanges();

    return Results.NoContent();
});

app.Run();
