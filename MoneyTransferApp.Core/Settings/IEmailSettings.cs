namespace MoneyTransferApp.Core.Settings
{
    public interface IEmailSettings
    {
        string UserName { get; set; }
        string Password { get; set; }
        string Host { get; set; }
        int Port { get; set; }
        string MailAddress { get; set; }
        string DisplayName { get; set; }
        string ReplyTo { get; set; }
        string To { get; set; }
        string Cc { get; set; }
        string Bcc { get; set; }
    }
}
