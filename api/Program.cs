using System.Collections.Generic;
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
    return db.Restaurants.ToList();
});

// GET a single restaurant from the database
app.MapGet("/restaurants/{id}", (RestaurantDb db, int id) =>
{
    var restaurant = db.Restaurants.Find(id);
    return restaurant != null ? Results.Ok(restaurant) : Results.NotFound();
});

// Endpoint to create (POST) a new restaurant
app.MapPost("/restaurants", (RestaurantDb db, Restaurant restaurant) =>
{
    // In a real app, you would generate a new Id. We'll skip that for now.
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

app.Run();

// The blueprint for our data. I've added an Id property.
public class Restaurant
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Rating { get; set; }
    public string? Location { get; set; }
    public DateTime? EstablishedDate { get; set; }
}

public class RestaurantDb : DbContext
{
    public RestaurantDb(DbContextOptions<RestaurantDb> options) : base(options) { }

    public DbSet<Restaurant> Restaurants { get; set; }
}