namespace MoneyTransferApp.Core.Interfaces
{
    public enum NotificationEventEnum
    {
        SignUpConfirm = 1,
        ReepayInvoiceSettled = 2
    }

    public interface INotificationServices
    {
		string CreateEmailContent();
    }
}
