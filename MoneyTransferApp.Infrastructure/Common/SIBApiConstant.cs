namespace MoneyTransferApp.Infrastructure.Common
{
    public static class SIBApiConstant
    {
        public const string GetSMTPTemplateInfo = "/v3/smtp/templates/{0}";
        public const string ContactApi = "/v3/contacts";
        //EN
        public const string Confirm_Signup = "Confirm SignUp";
        public const string JoinComplyto = "Join Complyto app";
        public const string NotVerified = "Not verified";
        public const string ResetPassword = "Reset Password";
        public const string Reset_Here = "Reset here";
        //DA
        public const string DA_Confirm_Signup = "Bekræft Tilmelding";
        public const string DA_JoinComplyto = "Deltagelse ComplyTo appen";
        public const string DA_NotVerified = "Ikke verificeret";
        public const string DA_ResetPassword = "Nulstille kodeord";
        public const string DA_Reset_Here = "Nulstil her";
        //constant template id
        public const int WelcomeTplId = 1;
        public const int DA_WelcomeTplId = 4;
        public const int InviteTeamMemberTplId = 5;
        public const int DA_InviteTeamMemberTplId = 6;
        public const int ForgotPassTplId = 7;
        public const int DA_ForgotPassTplId = 8;
        public const int InvoicesTplId = 9;
        public const int DA_InvoicesTplId = 11;
        public const int ShareDpaTplId = 26;
        public const int DA_ShareDpaTplId = 27;
    }
}
