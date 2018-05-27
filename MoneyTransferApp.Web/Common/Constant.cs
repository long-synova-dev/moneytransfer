namespace MoneyTransferApp.Web.Common
{
    public static class Constant
    {
        public const string UPLOAD_FILES = "./UploadFiles/";
        public const string JOIN_SEPERATOR = ",";

        public const string LANGUAGE_JSON = "./Data/language.json";
        public const string SENDER_JSON = "./Data/sender.json";

        /// <summary>
        /// Number of pages which are not question pages
        /// </summary>
        public const int ALL_OTHER_PAGES = 2;
        /// <summary>
        /// Return the default language Id (English)
        /// </summary>
        public const int DEFAULT_LANGUAGE = 1;
        public const string SPACE = " ";
        public const int MAX_TEXT_LENGTH_DISPLAY_IN_DROPDOWN = 30;

        public enum Language {
            English = 1,
            Danish = 2
        }
    }
}
