namespace FoodDeliveryApi.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Added default
        public int Rating { get; set; }
        public string? Location { get; set; }
        public DateTime? EstablishedDate { get; set; }

        public List<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}