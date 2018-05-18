namespace MoneyTransferApp.Core.Settings
{
    public class ErrorEmailSettings : IEmailSettings
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string MailAddress { get; set; }
        public string DisplayName { get; set; }
        public string ReplyTo { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }
    }
}
