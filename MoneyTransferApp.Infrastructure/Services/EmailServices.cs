using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Linq;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Core.Settings;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MoneyTransferApp.Infrastructure.Services
{
	public class EmailServices : IEmailServices
	{
		private readonly ILogger<EmailServices> _logger;
		private readonly EmailSettings _emailSettings;
	    private readonly ErrorEmailSettings _errorEmailSettings;
        private readonly IUnitOfWork _unitOfWork;

		private StringBuilder _signature = null;
		StringBuilder Signature
		{
			get
			{
				if (_signature == null)
				{
					_signature = new StringBuilder();
					_signature.Append("\n");
					_signature.Append("ComplyTo Solutions ApS\n");
					_signature.Append("Store Kongensgade 93, 2\n");
					_signature.Append("1264 København K\n");
				    _signature.Append("CVR/VAT number: 29448264\n");
                    _signature.Append("Mail: info@complyto.com\n");
					_signature.Append("www.complyto.com\n");
				}
				return _signature;
			}
		}

		public EmailServices(IOptions<EmailSettings> emailSettings, IOptions<ErrorEmailSettings> errorEmailSettings, IUnitOfWork unitOfWork, ILogger<EmailServices> logger)
		{
			_emailSettings = emailSettings.Value;
		    _errorEmailSettings = errorEmailSettings.Value;
            _logger = logger;
			_unitOfWork = unitOfWork;
		}
		
		public bool SendExceptionError(string message, params object[] args)
		{
			MailMessage mail = new MailMessage();
		    StringBuilder body = new StringBuilder();
			body.Append("Here is the detail of the exception:\n\n");
			body.Append(message + "\n\n");
			mail.Body = body.ToString();
			mail.Subject = "Application Exception Error";
            mail.To.Add(_errorEmailSettings.To);

			ComplyToSmtp smtp = new ComplyToSmtp(_errorEmailSettings, _logger);
			var isSuccess = smtp.Send(mail);

			return isSuccess;
		}

		public bool SendMailWithTemplate(int eventId, int? languageId, string recipientEmail, string subjectData = "", string bodyData = "")
		{
		    MailMessage mail = new MailMessage();

			StringBuilder body = new StringBuilder();

			string message = String.Empty;
			string subject = String.Empty;

			var objMessageTemplate = _unitOfWork.NotificationTemplateRepository.All().SingleOrDefault(s => s.NotificationEventId == eventId);
			if (objMessageTemplate != null)
			{
				var translation = _unitOfWork.TranslationRepository.All().Where(s => s.LanguageId == languageId);
				message = translation.SingleOrDefault(s => s.TranslationId == objMessageTemplate.MessageTranslationId)?.TranslatedText;
				subject = translation.SingleOrDefault(s => s.TranslationId == objMessageTemplate.SubjectTranslationId)?.TranslatedText;
			}

            //Replace template with data
		    subject = ReplaceTemplateWithData(subject, subjectData);
            message = ReplaceTemplateWithData(message, bodyData);

            body.Append(message);
			body.Append("\n");

			//signature
			body.Append(Signature);

			mail.Body = body.ToString();
			mail.Subject = subject;
			mail.To.Add(recipientEmail);
			if (!_emailSettings.Bcc.Equals(string.Empty))
			{
				mail.Bcc.Add(_emailSettings.Bcc);
			}

            ComplyToSmtp smtp = new ComplyToSmtp(_emailSettings, _logger);
			var isSuccess = smtp.Send(mail);

			return isSuccess;
		}

		public async Task<bool> SendMailAsync(string mailAddress, string subject, string message)
		{
			MailMessage mail = new MailMessage();
			bool isSuccess = false;
			mail.Body = message;
			mail.Subject = subject;
			mail.To.Add(mailAddress);
			if (!_emailSettings.Bcc.Equals(string.Empty))
			{
				mail.Bcc.Add(_emailSettings.Bcc);
			}

            if (message.Contains("<") && message.Contains(">"))
			{
				mail.IsBodyHtml = true;
			}

			ComplyToSmtp smtp = new ComplyToSmtp(_emailSettings, _logger);
			isSuccess = await smtp.SendAsync(mail);
			return isSuccess;
		}

	    private static string ReplaceTemplateWithData(string template, string data)
	    {
	        var parsedBodyData = (JObject)JsonConvert.DeserializeObject(data);
	        foreach (var keyValuePair in parsedBodyData)
	        {
	            template = template.Replace($"##{keyValuePair.Key}##", keyValuePair.Value.ToString());
	        }

	        return template;
	    }
	}

	public class ComplyToSmtp
	{
		private readonly IEmailSettings _emailSettings;
		private readonly ILogger _logger;

		private SmtpClient _smtpclient;
		public SmtpClient SmtpClient
		{
			get
			{
			    if (_smtpclient != null) return _smtpclient;
			    _smtpclient = new SmtpClient(_emailSettings.Host)
			    {
			        Port = _emailSettings.Port,
			        Credentials = new NetworkCredential(_emailSettings.UserName, _emailSettings.Password)
			    };

			    if (_emailSettings.UserName.Equals("testing@complyto.com"))
			    {
			        _smtpclient.EnableSsl = true;
			    }
			    return _smtpclient;
			}
			set => _smtpclient = value;
		}

		public ComplyToSmtp(EmailSettings emailSettings, ILogger logger)
		{
			_emailSettings = emailSettings;
			_logger = logger;
		}

	    public ComplyToSmtp(ErrorEmailSettings emailSettings, ILogger logger)
	    {
	        _emailSettings = emailSettings;
	        _logger = logger;
        }


	    public bool Send(MailMessage mail)
		{
			mail.From = new MailAddress(_emailSettings.MailAddress, _emailSettings.DisplayName);
			mail.ReplyToList.Add(_emailSettings.ReplyTo);
			try
			{
				SmtpClient.Send(mail);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
			}
			return true;
		}

		public async Task<bool> SendAsync(MailMessage mail)
		{
			mail.From = new MailAddress(_emailSettings.MailAddress, _emailSettings.DisplayName);
			mail.ReplyToList.Add(_emailSettings.ReplyTo);
			try
			{
				await SmtpClient.SendMailAsync(mail);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
			}
			return true;
		}
	}
}
