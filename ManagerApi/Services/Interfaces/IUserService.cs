public interface IUserService
{
    Task<List<UserDetailDto>> GetAllAsync();
    Task<UserDetailDto?> GetByIdAsync(int id);
    Task<UserDetailDto> CreateAsync(CreateUserDto dto);
    Task<bool> UpdateAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteAsync(int id);
}
