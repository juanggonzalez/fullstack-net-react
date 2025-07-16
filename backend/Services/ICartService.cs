using FullstackNetReact.Dtos;

namespace FullstackNetReact.Services
{
    public interface ICartService
    {
        Task<ShoppingCartDto> GetUserShoppingCartAsync(string userId);
        Task<ShoppingCartDto> SyncShoppingCartAsync(string userId, ShoppingCartDto incomingCartDto);
    }
}
