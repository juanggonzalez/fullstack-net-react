using FullstackNetReact.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FullstackNetReact.Services
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderFromShoppingCartAsync(string userId, int shippingAddressId, int billingAddressId, string? paymentMethod);
        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(string userId);
        Task<OrderDto> GetOrderByIdAsync(string userId, int orderId);
    }
}