using System;

namespace MoneyTransferApp.Core.Exceptions
{
    public class ExceptionHandler : Exception
    {
        public ExceptionHandler(string message, Exception innerException = null)
            : base(message, innerException: innerException)
        {
        }
        public ExceptionHandler() : base()
        {
        }
    }
}
