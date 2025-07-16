using FullstackNetReact.Dtos;
using FullstackNetReact.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FullstackNetReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        [HttpGet]
        public async Task<ActionResult<ShoppingCartDto>> GetShoppingCart()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuario no autenticado.");
            }
            var cart = await _cartService.GetUserShoppingCartAsync(userId);
            return Ok(cart);
        }

        [HttpPut("sync")] 
        public async Task<ActionResult<ShoppingCartDto>> SyncShoppingCart([FromBody] ShoppingCartDto incomingCartDto)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuario no autenticado.");
            }
            try
            {
                if (incomingCartDto.UserId != userId)
                {
                    return BadRequest("El ID de usuario en el carrito no coincide con el usuario autenticado.");
                }

                var updatedCart = await _cartService.SyncShoppingCartAsync(userId, incomingCartDto);
                return Ok(updatedCart);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
