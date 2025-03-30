using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace back_end_tourism.Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Attraction> Attractions { get; set; }
        public DbSet<User> Users { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Attraction>()
                .HasKey(b => b.Id);

            modelBuilder.Entity<Attraction>()
                .Property(b => b.Name)
                .IsRequired();

            modelBuilder.Entity<Attraction>()
                .Property(b => b.Description);

            modelBuilder.Entity<Attraction>()
                .Property(b => b.EntryFee)
                .IsRequired();
            modelBuilder.Entity<Attraction>()
                .Property(b => b.Location)
                .IsRequired();
            modelBuilder.Entity<Attraction>()
                .Property(b => b.OpeningHours);
            modelBuilder.Entity<Attraction>()
                .Property(b => b.Rating);
            modelBuilder.Entity<Attraction>()
                .Property(b => b.Category);

            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

        }
    }
}
