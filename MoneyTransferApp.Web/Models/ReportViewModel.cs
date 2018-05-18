namespace MoneyTransferApp.Web.Models
{
    public class ReportViewModel
    {
        public int StartTest { get; set; }
        public int CompleteTest { get; set; }
        public int ReceiveNewsLetter { get; set; }
        public int ReceivePDF { get; set; }
        public int AcceptFreeOffer { get; set; }

        public decimal NonOrLimitedExposure { get; set; }
        public decimal LessExposure { get; set; }
        public decimal MediumExposure { get; set; }
        public decimal HighExposure { get; set; }
    }
}
