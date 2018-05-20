using System;
using MoneyTransferApp.Core.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using MoneyTransferApp.Core.Entities.Client;

namespace MoneyTransferApp.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, Guid, UserClaim, UserRole, UserLogin, RoleClaim,
        UserToken>
    {
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Receiver> Receivers { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(entity =>
            {
                entity.ToTable("User", "User");
                entity.Property(e => e.Id).HasColumnName("UserId");
                entity.Property(e => e.ConcurrencyStamp).HasMaxLength(36);
                entity.Property(e => e.SecurityStamp).HasMaxLength(36);
                entity.Property(e => e.PasswordHash).HasMaxLength(256);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);

            });

            builder.Entity<Role>(entity =>
            {
                entity.ToTable("Role", "User");
                entity.Property(e => e.Id).HasColumnName("RoleId");
                entity.Property(e => e.ConcurrencyStamp).HasMaxLength(36);
            });

            builder.Entity<UserClaim>(entity =>
            {
                entity.ToTable("UserClaim", "User");
                entity.Property(e => e.UserId).HasColumnName("UserId");
                entity.Property(e => e.Id).HasColumnName("UserClaimId");
            });

            builder.Entity<UserLogin>(entity =>
            {
                entity.ToTable("UserLogin", "User");
            });

            builder.Entity<RoleClaim>(entity =>
            {
                entity.ToTable("RoleClaim", "User");
                entity.Property(e => e.Id).HasColumnName("RoleClaimId");
            });

            builder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRole", "User");
            });

            builder.Entity<UserToken>(entity =>
            {
                entity.ToTable("UserToken", "User");
            });
        }
    }
}