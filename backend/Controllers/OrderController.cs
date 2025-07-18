using FullstackNetReact.Dtos;
using FullstackNetReact.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FullstackNetReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        
        [HttpPost("checkout")]
        public async Task<ActionResult<OrderDto>> CreateOrderFromCart([FromBody] CreateOrderRequestDto requestDto)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuario no autenticado.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newOrder = await _orderService.CreateOrderFromShoppingCartAsync(
                    userId,
                    requestDto.ShippingAddressId,
                    requestDto.BillingAddressId,
                    requestDto.PaymentMethod 
                );
                return CreatedAtAction(nameof(GetOrderById), new { id = newOrder.Id }, newOrder); 
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); 
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor al procesar el pedido: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuario no autenticado.");
            }

            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuario no autenticado.");
            }

            var order = await _orderService.GetOrderByIdAsync(userId, id);
            if (order == null)
            {
                return NotFound($"Pedido con ID {id} no encontrado o no pertenece a este usuario.");
            }
            return Ok(order);
        }
    }
}