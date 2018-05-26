using System.Linq;
using MoneyTransferApp.Infrastructure.Data;
using MoneyTransferApp.Core.Entities.Users;
using System;

namespace MoneyTransferApp.Infrastructure.Migrations
{
    public static class DatabaseSeeder
    {
        public static void EnsureSeeded(this ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Roles.Any())
            {
                context.Roles.Add(new Role { Id = Guid.Parse("FBD6D0BD-D3C0-4087-AA7B-5201119807CE"), ConcurrencyStamp = "2cfb3bca-a93a-4c2f-a0b7-90bf513d8264", Name = "R0", NormalizedName = "R0" });
                context.Roles.Add(new Role { Id = Guid.Parse("0DDE8926-A4F7-433B-8F9D-F6ECAAB4B12D"), ConcurrencyStamp = "aab611e7-d19d-401d-94f7-e80afda7d29a", Name = "R1", NormalizedName = "R1" });
                context.Roles.Add(new Role { Id = Guid.Parse("A24F1ADD-DF3C-485B-9CE1-675AF9A8A22C"), ConcurrencyStamp = "eeb7cee9-3277-48df-bdde-73b0c501080b", Name = "R2", NormalizedName = "R2" });
            }
            
            context.SaveChanges();
        }
    }
}
