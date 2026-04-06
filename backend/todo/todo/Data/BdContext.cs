using Microsoft.EntityFrameworkCore;
using todo.Models;

namespace todo.Data;

public class BdContext : DbContext
{
    public BdContext(DbContextOptions<BdContext> options) : base(options) { }
    public DbSet<Todo> Todos => Set<Todo>();
}