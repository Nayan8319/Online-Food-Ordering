namespace FoodieApi.Models.DTO
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalOrders { get; set; }
        public int TotalMenus { get; set; }
        public int TotalCategories { get; set; }
        public decimal TotalSales { get; set; }
    }

    public class LatestOrderDto
    {
        public string OrderNo { get; set; }
        public string Username { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
    }
}