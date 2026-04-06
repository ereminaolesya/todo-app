using Microsoft.EntityFrameworkCore;
using todo.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BdContext>(opt =>
    opt.UseSqlite("Data Source=todos.db"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(p => p.AddDefaultPolicy(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BdContext>();
    db.Database.EnsureCreated();
}

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();


app.MapControllers();
app.Run();

