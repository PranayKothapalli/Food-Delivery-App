namespace FoodDeliveryApi.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Added default
        public string Description { get; set; } = string.Empty; // Added default
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }

        public int RestaurantId { get; set; }
    }
}