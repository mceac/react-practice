using System.ComponentModel.DataAnnotations;

public class UpdateUserDto
{
    [Required]
    public required string Name { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }
}
