using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using todo.Data;
using todo.Models;

namespace todo.Controllers;

[ApiController]
[Route("todos")]
public class TDController : ControllerBase
{
    private readonly BdContext _db;
    public TDController(BdContext db) => _db = db;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Todo>>> GetAll()
    {
        return await _db.Todos.AsNoTracking().ToListAsync();
    }
    
    [HttpPost]
    public async Task<ActionResult<Todo>> Add([FromBody] Todo todo)
    {
        if (string.IsNullOrWhiteSpace(todo.Text))
            return BadRequest(new { error = "Текст не может быть пустым" });

        todo.Id = 0;
        todo.Done = false;

        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = todo.Id }, todo);
    }
    
    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Todo>> Edit(int id, [FromBody] string newText)
    {
        var t = await _db.Todos.FindAsync(id);
        if (t == null) return NotFound();
        if (string.IsNullOrWhiteSpace(newText)) return BadRequest();

        t.Text = newText;
        await _db.SaveChangesAsync();
        return Ok(t);
    }
    
    [HttpPatch("{id:int}/done")]
    public async Task<ActionResult<Todo>> SetDone(int id, [FromBody] bool done)
    {
        var t = await _db.Todos.FindAsync(id);
        if (t == null) return NotFound();

        t.Done = done;
        await _db.SaveChangesAsync();
        return Ok(t);
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var t = await _db.Todos.FindAsync(id);
        if (t == null) return NotFound();

        _db.Todos.Remove(t);
        await _db.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpPut]
    public async Task<ActionResult<IEnumerable<Todo>>> Replace([FromBody] List<Todo> items)
    {
        _db.Todos.RemoveRange(_db.Todos);
        await _db.SaveChangesAsync();

        foreach (var x in items)
        {
            if (string.IsNullOrWhiteSpace(x.Text)) continue;
            x.Id = 0;
            _db.Todos.Add(x);
        }
        await _db.SaveChangesAsync();

        return await _db.Todos.AsNoTracking().ToListAsync();
    }
}
