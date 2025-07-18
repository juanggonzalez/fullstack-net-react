using AutoMapper;
using FullstackNetReact.Data;
using FullstackNetReact.Dtos;
using FullstackNetReact.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FullstackNetReact.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<OrderDto> CreateOrderFromShoppingCartAsync(string userId, int shippingAddressId, int billingAddressId, string? paymentMethod)
        {
            var shoppingCart = await _context.ShoppingCarts
                .Include(sc => sc.Items)
                    .ThenInclude(sci => sci.Product) 
                .FirstOrDefaultAsync(sc => sc.UserId == userId);

            if (shoppingCart == null || !shoppingCart.Items.Any())
            {
                throw new InvalidOperationException("El carrito de compras está vacío o no existe para este usuario.");
            }

            var shippingAddress = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == shippingAddressId && a.UserId == userId);
            var billingAddress = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == billingAddressId && a.UserId == userId);

            if (shippingAddress == null)
            {
                throw new KeyNotFoundException($"La dirección de envío con ID {shippingAddressId} no fue encontrada o no pertenece a este usuario.");
            }
            if (billingAddress == null)
            {
                throw new KeyNotFoundException($"La dirección de facturación con ID {billingAddressId} no fue encontrada o no pertenece a este usuario.");
            }

            var newOrder = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Processing, 
                TotalAmount = shoppingCart.Items.Sum(item => item.Product.Price * item.Quantity),
                ShippingAddressId = shippingAddressId,
                BillingAddressId = billingAddressId,
                PaymentMethod = paymentMethod
            };

            foreach (var cartItem in shoppingCart.Items)
            {
                if (cartItem.Product == null) continue; 

                newOrder.OrderItems.Add(new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    PriceAtOrder = cartItem.Product.Price, 
                });
            }

            _context.Orders.Add(newOrder);

            _context.ShoppingCartItems.RemoveRange(shoppingCart.Items);
            shoppingCart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var createdOrder = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.ShippingAddress)
                .Include(o => o.BillingAddress)
                .FirstOrDefaultAsync(o => o.Id == newOrder.Id);

            return _mapper.Map<OrderDto>(createdOrder);
        }

        public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(string userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product) 
                .Include(o => o.ShippingAddress) 
                .Include(o => o.BillingAddress)  
                .OrderByDescending(o => o.OrderDate) 
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto> GetOrderByIdAsync(string userId, int orderId)
        {
            var order = await _context.Orders
                .Where(o => o.UserId == userId && o.Id == orderId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.ShippingAddress)
                .Include(o => o.BillingAddress)
                .FirstOrDefaultAsync();

            return _mapper.Map<OrderDto>(order);
        }
    }
}
