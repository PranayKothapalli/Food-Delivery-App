using FoodDeliveryApi.Models; // Import our models
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryApi.Data
{
    public class RestaurantDb : DbContext
    {
        public RestaurantDb(DbContextOptions<RestaurantDb> options) : base(options) { }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the Price column for MenuItems
            modelBuilder.Entity<MenuItem>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");
        }
    }
}