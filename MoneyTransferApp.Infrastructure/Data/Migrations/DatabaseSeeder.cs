using System.Linq;
using MoneyTransferApp.Core.Entities;
using MoneyTransferApp.Core.Entities.Internal;

namespace MoneyTransferApp.Infrastructure.Data.Migrations
{
    public static class DatabaseSeeder
    {
        public static void EnsureSeeded(this ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Languages.Any())
            {
                context.Languages.Add(new Language { LanguageCode = "en-UK", LanguageName = "English" });
                context.Languages.Add(new Language { LanguageCode = "da-DK", LanguageName = "Dansk" });
            }

            if (!context.NotificationEvents.Any())
            {
                context.NotificationEvents.Add(new NotificationEvent {});
            }


            context.SaveChanges();
        }
    }
}
