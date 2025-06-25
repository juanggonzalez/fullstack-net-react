using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FullstackNetReact.Models;
using Microsoft.AspNetCore.Identity; 

namespace FullstackNetReact.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; } = default!;
        public DbSet<ProductFeature> ProductFeatures { get; set; } = default!;
        public DbSet<Seller> Sellers { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Renombra las tablas de Identity para quitar el prefijo "AspNet"
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");

            // Seed Data para Categorías
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Electronics", Description = "Devices and gadgets" },
                new Category { Id = 2, Name = "Books", Description = "Literary works" },
                new Category { Id = 3, Name = "Clothing", Description = "Apparel and accessories" },
                new Category { Id = 4, Name = "Home & Kitchen", Description = "Appliances and decor" }
            );

            // Seed Data para Marcas
            modelBuilder.Entity<Brand>().HasData(
                new Brand { Id = 1, Name = "TechPro", Description = "Leading electronics manufacturer" },
                new Brand { Id = 2, Name = "Bookworm Inc.", Description = "Publisher of classic literature" },
                new Brand { Id = 3, Name = "FashionWear", Description = "Trendy clothing brand" }
            );

            // Seed Data para Vendedores
            modelBuilder.Entity<Seller>().HasData(
                new Seller { Id = 1, Name = "Electronics Hub", ContactInfo = "ventas@electronicshub.com" },
                new Seller { Id = 2, Name = "Literary Nook", ContactInfo = "info@literarynook.com" }
            );

            // Seed Data para Productos
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Laptop Gamer Xtreme", Description = "Potente laptop para juegos de alto rendimiento.", Sku = "LX-001", Price = 1200.00m, Stock = 10, CategoryId = 1, BrandId = 1, ImageUrl = "/images/laptop-gamer.jpg", SellerId = 1 },
                new Product { Id = 2, Name = "Monitor UltraWide 4K", Description = "Experiencia visual inmersiva con colores vibrantes.", Sku = "MUW-002", Price = 450.00m, Stock = 25, CategoryId = 1, BrandId = 1, ImageUrl = "/images/monitor-wide.jpg", SellerId = 1 },
                new Product { Id = 3, Name = "Teclado Mecánico RGB", Description = "Teclado de alto rendimiento con iluminación personalizable.", Sku = "TMR-003", Price = 90.00m, Stock = 50, CategoryId = 1, BrandId = 1, ImageUrl = "/images/teclado-mecanico.jpg", SellerId = 1 },
                new Product { Id = 4, Name = "Mouse Gaming Pro", Description = "Ratón ergonómico con alta precisión para gamers.", Sku = "MGP-004", Price = 55.00m, Stock = 75, CategoryId = 1, BrandId = 1, ImageUrl = "/images/mouse-gamer.jpg", SellerId = 1 },
                new Product { Id = 5, Name = "El Señor de los Anillos", Description = "Novela épica de fantasía de J.R.R. Tolkien.", Sku = "LSA-005", Price = 25.00m, Stock = 100, CategoryId = 2, BrandId = 2, ImageUrl = "/images/libro-elderring.jpg", SellerId = 2 },
                new Product { Id = 6, Name = "1984", Description = "Novela distópica de George Orwell.", Sku = "L1984-006", Price = 15.00m, Stock = 80, CategoryId = 2, BrandId = 2, ImageUrl = "/images/libro-novela.jpg", SellerId = 2 },
                new Product { Id = 8, Name = "Jeans Slim Fit", Description = "Jeans ajustados con diseño moderno.", Sku = "JSF-008", Price = 60.00m, Stock = 150, CategoryId = 3, BrandId = 3, ImageUrl = "/images/jeans.jpg", SellerId = 1 } // Asignar a un Seller existente
            );
            
            // Seed Data para Reviews
            modelBuilder.Entity<Review>().HasData(
                new Review { Id = 1, ProductId = 1, UserName = "Juan P.", Rating = 5, Comment = "¡Una bestia para los juegos! Súper rápida y no se calienta.", ReviewDate = DateTime.Parse("2024-06-01T10:00:00Z").ToUniversalTime() },
                new Review { Id = 2, ProductId = 1, UserName = "Maria L.", Rating = 4, Comment = "Buena laptop, aunque la batería podría durar un poco más.", ReviewDate = DateTime.Parse("2024-06-05T14:30:00Z").ToUniversalTime() },
                new Review { Id = 3, ProductId = 2, UserName = "Carlos M.", Rating = 5, Comment = "Calidad de imagen espectacular, ideal para diseño gráfico.", ReviewDate = DateTime.Parse("2024-05-20T09:00:00Z").ToUniversalTime() },
                new Review { Id = 4, ProductId = 5, UserName = "Laura D.", Rating = 5, Comment = "Lectura obligatoria para amantes de la fantasía. La edición es hermosa.", ReviewDate = DateTime.Parse("2024-06-10T11:00:00Z").ToUniversalTime() },
                new Review { Id = 5, ProductId = 5, UserName = "Diego S.", Rating = 4, Comment = "Me encantó la historia, pero el tamaño de la letra es un poco pequeño.", ReviewDate = DateTime.Parse("2024-06-12T16:00:00Z").ToUniversalTime() }
            );

            // Seed Data para Detalles
            modelBuilder.Entity<ProductFeature>().HasData(
                new ProductFeature { Id = 1, ProductId = 1, FeatureText = "Procesador Intel Core i9 de última generación" },
                new ProductFeature { Id = 2, ProductId = 1, FeatureText = "Tarjeta gráfica NVIDIA GeForce RTX 4080" },
                new ProductFeature { Id = 3, ProductId = 1, FeatureText = "32GB de RAM DDR5" },
                new ProductFeature { Id = 4, ProductId = 2, FeatureText = "Pantalla OLED de 34 pulgadas" },
                new ProductFeature { Id = 5, ProductId = 2, FeatureText = "Resolución 3840 x 1600" },
                new ProductFeature { Id = 6, ProductId = 5, FeatureText = "Edición de lujo con tapa dura" },
                new ProductFeature { Id = 7, ProductId = 5, FeatureText = "Incluye mapas detallados de la Tierra Media" }
            );

            // Relaciones 
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ApplicationUser>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ShoppingCart>()
                .HasKey(sc => sc.UserId);
            modelBuilder.Entity<ShoppingCart>()
                .HasOne(sc => sc.User)
                .WithOne(u => u.ShoppingCart)
                .HasForeignKey<ShoppingCart>(sc => sc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ShoppingCartItem>()
                .HasOne(sci => sci.ShoppingCart)
                .WithMany(sc => sc.Items)
                .HasForeignKey(sci => sci.ShoppingCartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ShoppingCartItem>()
                .HasOne(sci => sci.Product)
                .WithMany(p => p.ShoppingCartItems)
                .HasForeignKey(sci => sci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.ShippingAddress)
                .WithMany()
                .HasForeignKey(o => o.ShippingAddressId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.BillingAddress)
                .WithMany()
                .HasForeignKey(o => o.BillingAddressId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de DateTime a datetime2 para SQL Server
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetColumnType("datetime2");
                    }
                }
            }
        }
    }
}