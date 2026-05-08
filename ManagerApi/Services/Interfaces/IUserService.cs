public interface IUserService
{
    Task<List<UserDetailDto>> GetAllAsync();
    Task<UserDetailDto> GetByIdAsync(int id);
    Task<UserDetailDto> CreateAsync(CreateUserDto dto);
    Task UpdateAsync(int id, UpdateUserDto dto);
    Task DeleteAsync(int id);
}
