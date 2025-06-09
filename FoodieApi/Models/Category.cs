using System;
using System.Collections.Generic;

namespace FoodieApi.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual ICollection<Menu> Menus { get; set; } = new List<Menu>();
}
