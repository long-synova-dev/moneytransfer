export class Globals {
    // API URL
    static GET_OVERVIEW_URL = '/api/OverviewPage/GetAll';
    static REGISTER_DATA_URL = '/api/user/register';
    static RESET_PASSWORD_URL = '/api/user/ResetPassword';
    static FORGOT_PASSWORD_URL = '/api/user/ForgotPassword';
    static CONFIRM_SIGNUP_URL = '/api/user/ConfirmEmail';
    static GET_USER_IN_COMPANY = '/api/user/GetUsersInCompany';
    static GET_TOKEN_DATA_URL = '/api/auth/GenerateToken';
    static REFRESH_TOKEN_DATA_URL = '/api/auth/RefreshToken';
    static CLEAN_TOKEN_DATA_URL = '/api/Auth/Logout';
    static PING_HOME_URL = '/api/home/ping';
    static GET_CURRENT_USER_DATA_URL = '/api/auth/currentUser';
    static GET_LANGUAGES_URL = '/api/language/languages';
    static CHANGE_LANGUAGE_URL = '/api/user/changeLanguage';
    static GET_BILLING_PLANS_URL = '/api/billingplan/billingplans';
    static GET_ADDONS_PLANS_URL = '/api/billingplan/addons';
    static GET_CURRENT_BILLING_PLANS_URL = '/api/billingplan/currentStatus';
    static GET_GDPR_FIRST_STEP_DATA_URL = '/api/gdprstep1/loadData';
    static UPDATE_GDPR_FIRST_STEP_DATA_URL = '/api/gdprstep1/updateData';
    static CHECK_PAYMENT_METHOD_URL = '/api/subscription/CheckPaymentMethod';
    static CHANGE_SUBSCRIPTION_URL = '/api/subscription/changesubscription';
    static GET_SUBSCRIPTION_HISTORY_URL = '/api/subscription/getsubscriptionhistory';
    static CANCEL_SUBCRIPTION_URL = '/api/subscription/cancel';
    static GET_COUPON_INFO_URL = '/api/subscription/validateCoupon';
    static GET_TAGS_BY_CATEGORY_URL = '/api/gdprtag/GetCategory';
    static GET_MASTER_TAGS_BY_CATEGORY_URL = '/api/user/GetCategoryByCode';
    static GET_TYPES_BY_CATEGORY_URL = '/api/gdprtag/GetTagTypeByCategory';
    static ADD_TAGS_TO_TREE_URL = '/api/gdprtag/Add';
    static TRAVERSE_TAG_TREE_URL = '/api/gdprtag/Traverse';
    static GET_SUGGESTIONS_FOR_DATA_SOURCE_URL = '/api/gdprtag/GetSuggestionsForDataSources';
    static GET_SUGGESTIONS_FOR_METHOD_RECEIVE_URL = '/api/gdprtag/GetSuggestionsForMethodReceive';
    static GET_SUGGESTIONS_FOR_DATA_OWNER_URL = '/api/gdprtag/GetSuggestionsForDataOwners';
    static GENERATE_GDPR_PROGRAM_URL = '/api/gdprtag/generate';
    static GET_GDPR_WIZARD_STATUS_URL = '/api/GDPRHome/GetGDPRWizardStatus';
    static UPDATE_GDPR_WIZARD_STATUS_URL = '/api/GDPRHome/UpdateWizardStatus';
    static IS_GDPR_PROGRAM_GENERATED_URL = '/api/GDPRHome/isGdprProgramGenerated';
    static ADD_NEW_TASK_URL = '/api/task/add';
    static UPDATE_TASK_URL = '/api/task/update';
    static DELETE_TASK_URL = '/api/task/delete';
    static GET_TASK_URL = '/api/task/getbyid';
    static GETALL_TASK_URL = '/api/task/getall';
    static GET_PROCESS_OPTIONS_URL = '/api/task/GetProcessOptions';
    static GET_RISK_OPTIONS_URL = '/api/task/GetRiskOptions';
    static GET_USER_FROM_LOGIN_URL = '/api/user/GetUserFromLogin';
    static DELETE_USER_URL = '/api/user/DeleteUser';
    static SAVE_USER_URL = '/api/user/saveUser';
    static GET_ROLES_URL = '/api/user/getroles';
    static RESEND_INVITATION = '/api/user/SendInvitation';
    static GET_MAX_USERS_URL = '/api/user/GetMaximumUser';
    //POST: /api/gdprtag/UpdateStep3Status/{processId}/{privacyDataTypeId}/{isNotCompleted}
    static UPDATE_STEP3_STATUS_URL = '/api/gdprtag/UpdateStep3Status';
    static CHECK_RESTRICTED_IP = '/api/auth/CheckIpAddress';


    static GET_USER_BY_ID_URL = '/api/user/GetUserById';
    static GET_ALL_POLICY_URL = '/api/policy/GetAll';
    static GET_POLICY_BY_ID_URL = '/api/policy/GetById';
    static UPDATE_POLICY_URL = '/api/policy/Update';
    static GET_USER_STATUS_URL = '/api/user/getuserstatus';
    static CHANGE_ROLE_URL = '/api/user/changerole';
    static UPDATE_USER_BASIC_INFO_URL = '/api/user/updateuserinfo';
    static CHANGE_PASSWORD_URL = '/api/user/changepassword';
    static RESEND_EMAIL_CONFIRM_URL = '/api/user/resendemailconfirm';
    
    static GET_ALL_DATA_PROCESSOR_URL = '/api/dataprocessor/GetAll';
    static GET_COUNTERPART_URL = '/api/dataprocessor/GetCounterpart';
    static UPDATE_COUNTERPART_URL = '/api/dataprocessor/UpdateCounterpart';
    static GET_ALL_DATA_PROCESSOR_BY_ID_URL = '/api/dataprocessor/GetById';
    static UPDATE_DATA_PROCESSOR_URL = '/api/dataprocessor/Update';
    static SEND_DATA_PROCESSOR_URL = '/api/dataprocessor/SendDataProcessor';    
    static COPY_DATA_PROCESSOR_URL = '/api/dataprocessor/CopyDataProcessor';    
    static DELETE_DATA_PROCESSOR_URL = '/api/dataprocessor/DeleteDataProcessor';    
    
    static GET_QUESTION_BY_CODE = '/api/gdprtag/GetQuestionByCode';
    static GET_ALL_TASK_BY_TYPE = '/api/task/GetAllTaskBy';
    static UPDATE_ASSIGNEE_OF_TASK = '/api/task/UpdateAssignee';
    static CHANGE_STATUS_OF_TASK = '/api/task/ChangeStatus';
    static GET_TASK_DETAIL = '/api/task/GetTaskDetail';
    static UPDATE_TASK = '/api/task/UpdateTask';
    // Risks
    static GET_ALL_RISK_URL = '/api/risk/GetAll';
    static GET_RISK_BY_ID_URL = '/api/risk/getriskbyid';
    static ADD_NEW_RISK_URL = '/api/risk/addnewrisk';
    static UPDATE_RISK_URL = '/api/risk/update';
    static GET_RISKTYPE_OPTIONS_URL = '/api/risk/getrisktypeoptions';
    static GET_ORGANIZATION_OPTIONS_URL = '/api/risk/getorganizationoptions';
    static GET_ALL_PROCESS_FROM_COMPANY_URL = '/api/risk/getallprocess';

    // Files
    static UPLOAD_FILE_URL = '/api/attachment/UploadFile';
    static GET_UPLOADED_FILE_URL = '/api/attachment/GetUploadedFile';
    static DOWNLOAD_FILE_URL = '/api/attachment/DownloadFile';
    static DOWNLOAD_AS_PDF_URL = '/api/attachment/DownloadPdf';
    static DELETE_FILE_URL = '/api/attachment/DeleteFile';
    static IS_HAS_CONTENT = '/api/attachment/ishascontent';
    static GET_REMAINING_QUOTA = '/api/attachment/GetRemainingQuota';

    // Histories:
    static GET_HISTORY_OF_TYPE= '/api/history/GetHistoryOfType';
    static DOWNLOAD_PDF_FILE = '/api/attachment/DownloadPDF';

    // Person data
    static GET_ALL_PROCESSES= '/api/persondata/getallprocesses';
    static GET_PERSONGROUPS_BY_PROCESS= '/api/persondata/GetPersonGroupsByProcess';
    static GET_ALL_FILTER_DATA= '/api/persondata/GetAllFiltersData';
    static GET_ALL_PURPOSES= '/api/persondata/GetAllPurposes';
    static ADD_PURPOSE= '/api/persondata/Save';
    static ADD_VENDOR = '/api/persondata/addvendor/';
    static SAVE_VENDOR_ON_PURPOSE = '/api/persondata/savevendor/';
    static UPDATE_VENDOR = '/api/persondata/updatevendor/';
    static GET_VENDOR_LIST = '/api/persondata/GetPurposesWithDataType/';
    static GET_VENDOR_CATEGORY = '/api/persondata/GetVendorCategories/';
    static GET_VENDOR_SALES_GROUP = '/api/persondata/GetSalesGroup/';
    static DELETE_VENDOR = '/api/persondata/deletevendor/';
    
    static POLICY_FILE = '1';
    static DATAPROCESSOR_FILE = '2';
    static TASK_FILE = '3';
    static TODO_FILE = '4';
    static VENDOR_FILE = '5';

    // REGEX
    static PASSWORD_REGEX_VALIDATE = /^(?=.*[A-ZÆÅØ])(?=.*\d)[\wÆæÅåØø\W]{6,}$/;
    //static EMAIL_REGEX_VALIDATE = /^.*[ÆæÅåØø\w]+([\.-]?[ÆæÅåØø\w]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    static EMAIL_REGEX_VALIDATE = /^(?!.*\.{2})([a-zA-Z0-9ÆæÅåØø'*+\/=?^_`{|}~-]+([\.][a-zA-Z0-9ÆæÅåØø'*+\/=?^_`{|}~-]+)*)@((([\-]?[a-zA-Z0-9]){2,}[\.])*(([a-zA-Z0-9][\-]?))+).(([\.]([a-zA-Z0-9][\-]?){2,}([a-zA-Z0-9])*)+)$/;
    static HTML_TEMPLATE_REGEX = /\[\[(.*?)\]\]/;
    static NUMBER_REGEX = /^\d+$/;

    //Category Code
    static CATEGORY_INDUSTRY = 'A';
    static CATEGORY_NUMBER_OF_EMPLOYEES = 'B';
    static CATEGORY_CURRENCY = 'C';
    static CATEGORY_COUNTRY = 'D';
    static CATEGORY_PROCESS = 'E';
    static CATEGORY_IT_SYSTEM = 'F';
    static CATEGORY_PERSON_GROUP = 'G';
    static CATEGORY_PERSONAL_DATA_TYPE = 'H';
    static CATEGORY_DATA_SOURCE = 'I';
    static CATEGORY_DATA_OWNER = 'J';
    static CATEGORY_IT_SYSTEM_TYPE = 'K';
    static CATEGORY_IT_SYSTEM_SERVICE_PROVIDER = 'L';
    static CATEGORY_ACCESS_METHOD = 'M';
    static CATEGORY_SECURITY_MEASURE = 'N';
    static CATEGORY_PURPOSE = 'O';
    static CATEGORY_DELETION_OF_DATA = 'P';
    static CATEGORY_COUNTRY_VAT_CODE = 'VAT';
    static CATEGORY_TRANSFER_OF_DATA = 'TD';    
    static CATEGORY_ALL_COUNTRIES = 'D2';
    static CATEGORY_LEGISLATION = "LEG";
    static CATEGORY_EXCHANGEDATA = "ED";
    static CATEGORY_CONTROL_ASSERTION = "CA";

    // Question Code
    static QUESTION_INCLUDE_CHILDREN = 'CHILD';
    static QUESTION_PRIVACY_DATA = 'PRIV';

    static MAX_FILE_SIZE_TO_UPLOAD = 10 * 1024 * 1024;
}