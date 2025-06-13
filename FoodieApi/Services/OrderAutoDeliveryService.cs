using FoodieApi.Models;
using Microsoft.EntityFrameworkCore;

public class OrderAutoDeliveryService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1); // check every 1 minute

    public OrderAutoDeliveryService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<FoodieOrderningContext>();

            var autoDeliveryCutoff = DateTime.Now.AddMinutes(-5);

            var ordersToDeliver = await context.Orders
                .Where(o => o.Status == "OutForDelivery" && o.OrderDate <= autoDeliveryCutoff)
                .ToListAsync(stoppingToken);

            foreach (var order in ordersToDeliver)
            {
                order.Status = "Delivered";
            }

            if (ordersToDeliver.Any())
            {
                await context.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
