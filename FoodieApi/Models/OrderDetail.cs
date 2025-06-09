using System;
using System.Collections.Generic;

namespace FoodieApi.Models;

public partial class OrderDetail
{
    public int OrderDetailId { get; set; }

    public int OrderId { get; set; }

    public int MenuId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual Menu Menu { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
