namespace MoneyTransferApp.Web.Common
{
    public static class Constant
    {
        public const string JSON_QUESTIONS_PATH = "./Areas/GDPRTest/Data/QuestionLiz/questionliz.json";
        public const string PDF_RESULTS_MAPPING_PATH = "./ExportData/Results.json";
        public const string PDF_FOLDER_PATH = "./ExportData/Files/";
        public const string EXCEL_FOLDER_PATH = "./ExportData/Files";
        public const string PDF_LOGO_HEADER = "./ExportData/Images/logo.gif";
        public const string PDF_BACKGROUND_IMG = "./ExportData/Images/background.png";
        public const string PDF_CONTENT_TEXT = "./ExportData/content.txt";
        public const string PDF_LOGO_RESULTAT = "./ExportData/Images/logo_resultat.png";
        public const string PDF_SPEEDO_10 = "./ExportData/Images/Speedometer_10.png";
        public const string PDF_SPEEDO_12 = "./ExportData/Images/Speedometer_12.png";
        public const string PDF_SPEEDO_14 = "./ExportData/Images/Speedometer_14.png";
        public const string PDF_SPEEDO_16 = "./ExportData/Images/Speedometer_16.png";
        public const string PDF_SPEEDO_18 = "./ExportData/Images/Speedometer_18.png";
        public const string UPLOAD_FILES = "./UploadFiles/";
        public const string JOIN_SEPERATOR = ",";

        // Category Code const
        internal const string CATEGORY_ITSYSTEM = "F";
        internal const string CATEGORY_ITSYSTEM_TYPE = "K";
        internal const string CATEGORY_SERVICE_PROVIDER = "L";
        internal const string CATEGORY_PROCESS = "E";
        internal const string CATEGORY_PERSON_TYPE = "G";
        internal const string CATEGORY_PERSON_DATA_TYPE = "H";
        internal const string CATEGORY_EXCHANGE_DATA = "ED";
        internal const string CATEGORY_PURPOSE = "O";
        internal const string CATEGORY_DELETION_PERIOD = "P";
        internal const string CATEGORY_COUNTRY = "D";
        internal const string CATEGORY_DATAOWNER = "J";

        internal const string TAG_DIRECTLY_FROM_PERSON = "51";
        internal const string TAG_THIRD_PARTY = "52";
        internal const string TAG_FROM_PROFILING = "54";
        internal const string TAG_MANAGE_DATA_FOR_CUSTOMER = "56";
        internal const string TAG_TYPE_EU = "15";
        internal const string TAG_TYPE_SENSITIVE_DATA = "2";
        internal const string TAG_TYPE_CRIMINAL_HISTORY = "3";
        internal const string TAG_TYPE_ORDINARY_DATA = "4";


        internal const int TAG_TYPE_EU_OR_EEA = 32;


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

        public const int GDPRSTEP1_GENERAL_REQUIRED_FIELD = 8;
        public const int GDPRSTEP1_SUBS_REQUIRED_FIELD = 5;
        public const int GDPRSTEP1_OVERALL_REQUIRED_FIELD = 5;
        public const int GDPRSTEP1_DPO_REQUIRED_FIELD = 5;

        public enum WizardStep {
            Step1 = 1,
            Step2 = 2,
            Step3 = 3
        }

        public enum Language {
            English = 1,
            Danish = 2
        }
    }
}
