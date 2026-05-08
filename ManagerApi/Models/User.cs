using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    public required string Name { get; set; }
    
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
}
