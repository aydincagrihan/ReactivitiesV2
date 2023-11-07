using API.Extensions;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();


// Configure the HTTP request pipeline.
//Yazdığım exception Middlewarei inject ediyoruz!
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
   // app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

using var scope=app.Services.CreateScope();
var services=scope.ServiceProvider;
try
{
    var context=services.GetRequiredService<DataContext>();
    var userManager=services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context,userManager);
    
}
catch (Exception ex)
{
    
    var logger=services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"Migration sırasında bir hata oluştur");
}

app.Run();
