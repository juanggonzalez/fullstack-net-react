// fullstack-net-react/Program.cs

using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using System.Text.Json.Serialization;
using EcommerceApi.Models; // Asegúrate de que tus modelos (ApplicationUser, Product, LoginDto, RegisterDto) estén aquí
using EcommerceApi.Services; // Asegúrate de que tus servicios (IProductService, ProductService) estén aquí

// Para Identity y JWT
using Microsoft.AspNetCore.Identity; // Necesario para UserManager, RoleManager, IdentityUser, IdentityRole
using Microsoft.AspNetCore.Authentication.JwtBearer; // Necesario para AddJwtBearer
using Microsoft.IdentityModel.Tokens; // Necesario para SymmetricSecurityKey, TokenValidationParameters
using System.Text; // Necesario para Encoding.UTF8
using System.Security.Claims; // Necesario para ClaimTypes
// Ya no necesitamos BCrypt.Net aquí directamente, Identity lo maneja.
// using BCrypt.Net; 

var builder = WebApplication.CreateBuilder(args);

// --- Configuración de Servicios ---

// Configuración de DbContext con SQL Server LocalDB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de ASP.NET Core Identity
// Usamos ApplicationUser porque ya lo has definido para propiedades adicionales.
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false; // Puedes cambiar esto para requerir confirmación de email
    // Opciones de contraseña (ajusta según tus necesidades de seguridad en desarrollo)
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6; // Mínimo de 6 caracteres para la contraseña de Identity
    options.Password.RequiredUniqueChars = 0;
})
.AddRoles<IdentityRole>() // ¡Añade soporte para roles!
.AddEntityFrameworkStores<ApplicationDbContext>(); // Conecta Identity a tu DbContext

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.WriteIndented = builder.Environment.IsDevelopment();
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- Configuración de Autenticación JWT ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddAuthorization(); // Habilitar autorización

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy => policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173") // URL de tu frontend
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Ejemplo de servicio (asegúrate de que IProductService y ProductService existan y sean correctos)
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// --- Configuración del Pipeline HTTP ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin"); // Debe ir antes de UseAuthentication/UseAuthorization

app.UseAuthentication(); // Debe ir antes de UseAuthorization
app.UseAuthorization();

// --- INICIO: SEED DATA PARA ROLES, USUARIOS Y PRODUCTOS ---
// Este bloque de código se ejecutará al iniciar la aplicación para inicializar la DB y datos
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<ApplicationDbContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>(); // Instancia de UserManager para ApplicationUser
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>(); // Instancia de RoleManager
    var logger = services.GetRequiredService<ILogger<Program>>(); // Logger para errores

    // 1. Aplicar migraciones pendientes (si no las has aplicado manualmente con 'dotnet ef database update')
    try
    {
        dbContext.Database.Migrate();
        logger.LogInformation("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while applying database migrations.");
        // Considera si quieres que la aplicación falle aquí si las migraciones no se aplican
    }

    // 2. Seed de Roles: Crea los roles "Admin" y "User" si no existen
    string[] roleNames = { "Admin", "User" };
    foreach (var roleName in roleNames)
    {
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            var result = await roleManager.CreateAsync(new IdentityRole(roleName));
            if (result.Succeeded)
            {
                logger.LogInformation($"Rol '{roleName}' creado exitosamente.");
            }
            else
            {
                logger.LogError($"Error al crear rol '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }

    // 3. Seed del usuario administrador: Crea el usuario "admin" si no existe y le asigna el rol "Admin"
    var adminUser = await userManager.FindByNameAsync("admin");
    if (adminUser == null)
    {
        adminUser = new ApplicationUser // Usa tu ApplicationUser
        {
            UserName = "admin",
            Email = "admin@example.com", // Es buena práctica tener un email para usuarios de Identity
            EmailConfirmed = true,       // Marca como confirmado para desarrollo (no requiere verificación real)
            FirstName = "Super",         // Ejemplo de propiedades adicionales
            LastName = "Admin"
        };
        // Crea el usuario con la contraseña. Identity se encarga del hashing.
        var createAdminResult = await userManager.CreateAsync(adminUser, "AdminPassword123!"); // ¡CAMBIA ESTA CONTRASEÑA POR UNA SEGURA Y RECUÉRDALA!
        if (createAdminResult.Succeeded)
        {
            // Asigna el rol "Admin" al usuario recién creado
            var addRoleResult = await userManager.AddToRoleAsync(adminUser, "Admin");
            if (addRoleResult.Succeeded)
            {
                logger.LogInformation("Usuario 'admin' creado y rol 'Admin' asignado exitosamente.");
            }
            else
            {
                logger.LogError($"Error al asignar rol 'Admin' a usuario 'admin': {string.Join(", ", addRoleResult.Errors.Select(e => e.Description))}");
            }
        }
        else
        {
            logger.LogError("Error al crear usuario 'admin':");
            foreach (var error in createAdminResult.Errors)
            {
                logger.LogError($"- {error.Description}");
            }
        }
    }
    // Opcional: Asegurarse de que el usuario 'admin' tenga el rol 'Admin' si ya existía pero por alguna razón no tenía el rol.
    else if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
    {
        var addRoleResult = await userManager.AddToRoleAsync(adminUser, "Admin");
        if (addRoleResult.Succeeded)
        {
            logger.LogInformation("Usuario 'admin' ya existe, rol 'Admin' asegurado.");
        }
        else
        {
            logger.LogError($"Error al asegurar rol 'Admin' para usuario 'admin': {string.Join(", ", addRoleResult.Errors.Select(e => e.Description))}");
        }
    }


    // 4. Seed de productos de ejemplo: Agrega productos si la tabla de Productos está vacía
    // Nota: Si ya tienes Product y Category/Brand Seed en OnModelCreating, esto podría duplicarlos
    // Considera consolidar todo el seeding en un solo lugar (OnModelCreating o este bloque).
    // Aquí asumo que quieres que este bloque maneje el seeding de productos también.
    if (!dbContext.Products.Any()) // Asume que tienes un DbSet<Product> en tu DbContext
    {
        var products = new List<Product>
        {
            // Asegúrate de que las CategoryId y BrandId coincidan con los IDs que se siembran en ApplicationDbContext.cs
            new Product { Name = "Laptop Gamer XYZ", Description = "Potente laptop para juegos.", Price = 1200.00m, Stock = 10, CategoryId = 1, BrandId = 1 },
            new Product { Name = "Monitor UltraWide 4K", Description = "Experiencia visual inmersiva.", Price = 450.00m, Stock = 25, CategoryId = 1, BrandId = 1 },
            new Product { Name = "Teclado Mecánico RGB", Description = "Teclado de alto rendimiento.", Price = 90.00m, Stock = 50, CategoryId = 1, BrandId = 1 },
            new Product { Name = "Mouse Gaming Pro", Description = "Ratón ergonómico alta precisión.", Price = 55.00m, Stock = 75, CategoryId = 1, BrandId = 1 },
            new Product { Name = "El Señor de los Anillos", Description = "Novela épica de fantasía.", Price = 25.00m, Stock = 100, CategoryId = 2, BrandId = 2 },
            new Product { Name = "1984", Description = "Novela distópica de George Orwell.", Price = 15.00m, Stock = 80, CategoryId = 2, BrandId = 2 },
            new Product { Name = "Camiseta Algodón Premium", Description = "Camiseta suave y cómoda.", Price = 30.00m, Stock = 200, CategoryId = 3, BrandId = 3 },
            new Product { Name = "Jeans Slim Fit", Description = "Jeans ajustados de moda.", Price = 60.00m, Stock = 150, CategoryId = 3, BrandId = 3 }
        };
        dbContext.Products.AddRange(products);
        await dbContext.SaveChangesAsync(); // Guardar todos los cambios de seed data de productos
        logger.LogInformation("Productos de ejemplo creados exitosamente.");
    }
}
// --- FIN: SEED DATA ---

app.MapControllers();

app.Run();