namespace MoneyTransferApp.Auth.Policies
{
    public static class PolicyNames
    {
        public const string SpecificEmailPolicy = "SpecificEmailPolicy";
        public const string PhoneConfirmedPolicy = "PhoneConfirmedPolicy";
        public const string AccountDomainPolicy = "AccountDomainPolicy";

        public const string AllPlansPolicy = "SmallMedLargePlanOnlyPolicy";
        public const string MedLargeOnlyPolicy = "MedLargeOnlyPolicy";
        public const string LargeOnlyPolicy = "LargeOnlyPolicy";
    }
}
