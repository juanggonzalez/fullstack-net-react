using System.ComponentModel.DataAnnotations;

namespace FullstackNetReact.Dtos
{
    public class CreateOrderRequestDto
    {
        [Required(ErrorMessage = "El ID de la dirección de envío es requerido.")]
        public int ShippingAddressId { get; set; }

        [Required(ErrorMessage = "El ID de la dirección de facturación es requerido.")]
        public int BillingAddressId { get; set; }

        public string? PaymentMethod { get; set; }
    }
}