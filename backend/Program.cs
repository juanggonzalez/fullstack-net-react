// fullstack-net-react/Program.cs

using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using System.Text.Json.Serialization;
using EcommerceApi.Models; 
using EcommerceApi.Services; 

// Para Identity y JWT
using Microsoft.AspNetCore.Identity; 
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens; 
using System.Text; 
using System.Security.Claims; 


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false; 
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6; 
    options.Password.RequiredUniqueChars = 0;
})
.AddRoles<IdentityRole>() 
.AddEntityFrameworkStores<ApplicationDbContext>(); 

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

builder.Services.AddAuthorization(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy => policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173") 
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin"); 

app.UseAuthentication(); 
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<ApplicationDbContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>(); 
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>(); 
    var logger = services.GetRequiredService<ILogger<Program>>(); 

    
    try
    {
        dbContext.Database.Migrate();
        logger.LogInformation("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while applying database migrations.");
        
    }

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

    var adminUser = await userManager.FindByNameAsync("admin");
    if (adminUser == null)
    {
        adminUser = new ApplicationUser 
        {
            UserName = "admin",
            Email = "admin@example.com", 
            EmailConfirmed = true,       
            FirstName = "Super",         
            LastName = "Admin"
        };
        var createAdminResult = await userManager.CreateAsync(adminUser, "AdminPassword123!"); 
        if (createAdminResult.Succeeded)
        {
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



    if (!dbContext.Products.Any()) 
    {
        var products = new List<Product>
        {
            new Product { Name = "Laptop Gamer XYZ", Description = "Potente laptop para juegos.", Price = 1200.00m, Stock = 10, CategoryId = 1, BrandId = 1, ImageUrl="/images/laptop-gamer.jpg" },
            new Product { Name = "Monitor UltraWide 4K", Description = "Experiencia visual inmersiva.", Price = 450.00m, Stock = 25, CategoryId = 1, BrandId = 1, ImageUrl="/images/monitor-wide.jpg" },
            new Product { Name = "Teclado Mecánico RGB", Description = "Teclado de alto rendimiento.", Price = 90.00m, Stock = 50, CategoryId = 1, BrandId = 1, ImageUrl="/images/teclado-mecanico.jpg" },
            new Product { Name = "Mouse Gaming Pro", Description = "Rat�n ergon�mico alta precisi�n.", Price = 55.00m, Stock = 75, CategoryId = 1, BrandId = 1, ImageUrl="/images/mouse-gamer.jpg" },
            new Product { Name = "El Señor de los Anillos", Description = "Novela úpica de fantasía.", Price = 25.00m, Stock = 100, CategoryId = 2, BrandId = 2, ImageUrl="/images/libro-elderring.jpg" },
            new Product { Name = "1984", Description = "Novela dist�pica de George Orwell.", Price = 15.00m, Stock = 80, CategoryId = 2, BrandId = 2, ImageUrl="/images/libro-novela.jpg" },
            new Product { Name = "Camiseta Algodón Premium", Description = "Camiseta suave y c�moda.", Price = 30.00m, Stock = 200, CategoryId = 3, BrandId = 3, ImageUrl="/images/camiseta-algodon.jpg" },
            new Product { Name = "Jeans Slim Fit", Description = "Jeans ajustados de moda.", Price = 60.00m, Stock = 150, CategoryId = 3, BrandId = 3, ImageUrl="/images/jeans.jpg" }
        };
        dbContext.Products.AddRange(products);
        await dbContext.SaveChangesAsync(); 
    }
}

app.MapControllers();

app.Run();