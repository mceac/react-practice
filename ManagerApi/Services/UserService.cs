using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDetailDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => new UserDetailDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email
            })
            .ToListAsync();
    }

    public async Task<UserDetailDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return null;

        return new UserDetailDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }

    public async Task<UserDetailDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDetailDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return false;

        user.Name = dto.Name;
        user.Email = dto.Email;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }
}
