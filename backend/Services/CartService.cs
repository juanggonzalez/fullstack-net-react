using AutoMapper;
using FullstackNetReact.Data;
using FullstackNetReact.Dtos;
using FullstackNetReact.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FullstackNetReact.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CartService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ShoppingCartDto> GetUserShoppingCartAsync(string userId)
        {
            var cart = await _context.ShoppingCarts
                .Include(sc => sc.Items)
                    .ThenInclude(sci => sci.Product)
                .FirstOrDefaultAsync(sc => sc.UserId == userId);

            if (cart == null)
            {
                cart = new ShoppingCart { UserId = userId, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                _context.ShoppingCarts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<ShoppingCartDto>(cart);
        }

        public async Task<ShoppingCartDto> SyncShoppingCartAsync(string userId, ShoppingCartDto incomingCartDto)
        {
            var existingCart = await _context.ShoppingCarts
                .Include(sc => sc.Items)
                    .ThenInclude(sci => sci.Product)
                .FirstOrDefaultAsync(sc => sc.UserId == userId);

            if (existingCart == null)
            {
                existingCart = new ShoppingCart { UserId = userId, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                _context.ShoppingCarts.Add(existingCart);
                await _context.SaveChangesAsync(); 
            }

            var incomingItemIds = new HashSet<int>(incomingCartDto.Items.Where(i => i.Id != 0).Select(i => i.Id));

            var itemsToRemove = existingCart.Items
                .Where(dbItem => !incomingItemIds.Contains(dbItem.Id) || incomingCartDto.Items.Any(incItem => incItem.Id == dbItem.Id && incItem.Quantity <= 0))
                .ToList();

            foreach (var item in itemsToRemove)
            {
                _context.ShoppingCartItems.Remove(item);
            }

            foreach (var incomingItemDto in incomingCartDto.Items)
            {
                if (incomingItemDto.Quantity <= 0) continue; 

                var existingItem = existingCart.Items.FirstOrDefault(dbItem => dbItem.Id == incomingItemDto.Id);

                if (existingItem != null)
                {
                    if (existingItem.Quantity != incomingItemDto.Quantity)
                    {
                        existingItem.Quantity = incomingItemDto.Quantity;
                        existingItem.AddedAt = DateTime.UtcNow;
                    }
                }
                else
                {
                    var product = await _context.Products.FindAsync(incomingItemDto.ProductId);
                    if (product == null)
                    {
                        throw new ArgumentException($"Producto con ID {incomingItemDto.ProductId} no encontrado para añadir al carrito.");
                    }

                    existingCart.Items.Add(new ShoppingCartItem
                    {
                        ProductId = incomingItemDto.ProductId,
                        Quantity = incomingItemDto.Quantity,
                        ShoppingCartId = existingCart.Id,
                        PriceAtTimeOfAddition = product.Price, 
                        AddedAt = DateTime.UtcNow
                    });
                }
            }

            existingCart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetUserShoppingCartAsync(userId);
        }
    }
}
