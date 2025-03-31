using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using server_solution.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var swaggerConfig = builder.Configuration.GetSection("Swagger");

if (swaggerConfig.GetValue<bool>("Enabled"))
{
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc(swaggerConfig["Version"], new OpenApiInfo
        {
            Title = swaggerConfig["Title"],
            Version = swaggerConfig["Version"],
            Description = swaggerConfig["Description"]
        });

        // Add JWT Authentication Support in Swagger
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Name = "Authorization",
            Description = "Enter 'Bearer {token}'",
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] {}
            }
        });
    });
}

// Add authentication
var jwtSecret = "SuperSecretKey123!"; // Change this, keep it secret and long
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:4999"; // Authentication server
        options.Audience = "http://localhost:5001"; // Python API
        options.RequireHttpsMetadata = false; // Allow HTTP (for local dev)
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false, // Set to true if you have a fixed issuer
            ValidateAudience = true,
            ValidAudience = "http://localhost:5001"
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder.WithOrigins("http://localhost:4200")  // Allow Angular frontend
                          .AllowAnyMethod()                     // Allow any HTTP method (GET, POST, etc.)
                          .AllowAnyHeader()                     // Allow any headers
                          .AllowCredentials());                 // Allow credentials if needed (e.g., cookies, auth headers)
});
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddHttpClient<ProxyService>();
builder.Services.AddHttpClient<DataService>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

var app = builder.Build();
app.UseCors("AllowAngularApp");
if (swaggerConfig.GetValue<bool>("Enabled"))
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint($"/swagger/{swaggerConfig["Version"]}/swagger.json", swaggerConfig["Title"]);
        options.RoutePrefix = string.Empty; // Serve Swagger at the root URL
    });
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
