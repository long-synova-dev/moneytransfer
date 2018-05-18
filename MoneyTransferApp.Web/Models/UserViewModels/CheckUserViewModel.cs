using MoneyTransferApp.Core.Entities.Client;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class CheckUserViewModel
    {
        public bool IsAddNew { get; set; }
        public PlanInfoViewModel Plan { get; set; }
        public SubscriptionStatus Status { get; set; }

    }

    public class PlanInfoViewModel
        {
        public string PlanName { get; set; }
        public string SubscriptionStatus { get; set; }
        public int? MaximumUser { get; set; }
        public string Description { get; set; }
    }
}
