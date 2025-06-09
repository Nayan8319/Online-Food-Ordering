using System;
using System.Collections.Generic;

namespace FoodieApi.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string OrderNo { get; set; } = null!;

    public int UserId { get; set; }

    public string Status { get; set; } = null!;

    public int PaymentId { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal TotalAmount { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual Payment Payment { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
