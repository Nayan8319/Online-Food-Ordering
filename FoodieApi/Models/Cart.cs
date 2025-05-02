using System;
using System.Collections.Generic;

namespace FoodieApi.Models;

public partial class Cart
{
    public int CartId { get; set; }

    public int MenuId { get; set; }

    public int Quantity { get; set; }

    public int UserId { get; set; }

    public decimal TotalPrice { get; set; }

    public virtual Menu Menu { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual User User { get; set; } = null!;
}
