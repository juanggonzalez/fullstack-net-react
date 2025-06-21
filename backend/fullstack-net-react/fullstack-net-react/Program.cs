using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data; 
using System.Text.Json.Serialization; 
using EcommerceApi.Models; 
using EcommerceApi.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Evita ciclos de referencia en objetos relacionados (importante para evitar errores en JSON)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        // Ignora propiedades nulas al serializar a JSON
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        // Formatea el JSON con indentación en modo desarrollo para mejor lectura
        options.JsonSerializerOptions.WriteIndented = builder.Environment.IsDevelopment();
        // Serializa enums como strings en lugar de números
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", 
        builder => builder.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173") 
                        .AllowAnyHeader()    // Permite cualquier encabezado HTTP
                        .AllowAnyMethod()    // Permite todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
                        .AllowCredentials()); // Permite el envío de cookies/credenciales 
});

builder.Services.AddAutoMapper(typeof(Program).Assembly); 


builder.Services.AddScoped<IProductService, ProductService>();

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

app.MapControllers();

app.Run();