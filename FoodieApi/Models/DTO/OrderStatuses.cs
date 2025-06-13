namespace FoodieApi.Helpers
{
    public static class OrderStatuses
    {
        public const string Pending = "Placed";
        public const string Confirmed = "Confirmed";
        public const string OutForDelivery = "OutForDelivery";
        public const string Delivered = "Delivered";

        public static readonly string[] All = { Pending, Confirmed, OutForDelivery, Delivered };
    }
}
