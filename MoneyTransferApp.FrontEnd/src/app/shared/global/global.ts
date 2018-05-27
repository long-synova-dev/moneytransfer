export class Globals {
    // API URL
    static REGISTER_DATA_URL = '/api/user/CreateAccount';
    static RESET_PASSWORD_URL = '/api/user/ResetPassword';
    static FORGOT_PASSWORD_URL = '/api/user/ForgotPassword';
    static CONFIRM_SIGNUP_URL = '/api/user/ConfirmEmail';
    static GET_TOKEN_DATA_URL = '/api/auth/GenerateToken';
    static REFRESH_TOKEN_DATA_URL = '/api/auth/RefreshToken';
    static CLEAN_TOKEN_DATA_URL = '/api/Auth/Logout';
    static GET_CURRENT_USER_DATA_URL = '/api/auth/currentUser';
    static GET_LANGUAGES_URL = '/api/language/all';
    static CHANGE_LANGUAGE_URL = '/api/user/changeLanguage';
    static GET_USER_FROM_LOGIN_URL = '/api/user/GetUserFromLogin';
    static DELETE_USER_URL = '/api/user/DeleteUser';
    static SAVE_USER_URL = '/api/user/saveUser';
    static GET_ROLES_URL = '/api/user/getroles';
    static RESEND_INVITATION = '/api/user/SendInvitation';
    static GET_USER_BY_ID_URL = '/api/user/GetUserById';
    static GET_USER_STATUS_URL = '/api/user/getuserstatus';
    static CHANGE_ROLE_URL = '/api/user/changerole';
    static UPDATE_USER_BASIC_INFO_URL = '/api/user/updateuserinfo';
    static CHANGE_PASSWORD_URL = '/api/user/changepassword';
    static RESEND_EMAIL_CONFIRM_URL = '/api/user/resendemailconfirm';

    // Customer
    static GET_ALL_CUSTOMER_URL = '/api/customer/getall';
    static GET_CUSTOMER_BY_ID_URL = '/api/customer/getbyid';
    static SAVE_CUSTOMER_URL = '/api/customer/save';
    static DELETE_CUSTOMER_URL = '/api/customer/delete';

    // Receiver
    static GET_RECEIVER_BY_CUSTOMER_URL = '/api/customer/getReceiverByCustomer';
    static GET_RECEIVER_BY_ID_URL = '/api/customer/getReceiverById';
    static SAVE_RECEIVER_URL = '/api/customer/saveReceiver';

    // REGEX
    static PASSWORD_REGEX_VALIDATE = /^(?=.*[A-ZÆÅØ])(?=.*\d)[\wÆæÅåØø\W]{6,}$/;
    //static EMAIL_REGEX_VALIDATE = /^.*[ÆæÅåØø\w]+([\.-]?[ÆæÅåØø\w]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    static EMAIL_REGEX_VALIDATE = /^(?!.*\.{2})([a-zA-Z0-9ÆæÅåØø'*+\/=?^_`{|}~-]+([\.][a-zA-Z0-9ÆæÅåØø'*+\/=?^_`{|}~-]+)*)@((([\-]?[a-zA-Z0-9]){2,}[\.])*(([a-zA-Z0-9][\-]?))+).(([\.]([a-zA-Z0-9][\-]?){2,}([a-zA-Z0-9])*)+)$/;
    static HTML_TEMPLATE_REGEX = /\[\[(.*?)\]\]/;
    static NUMBER_REGEX = /^\d+$/;

    static MAX_FILE_SIZE_TO_UPLOAD = 10 * 1024 * 1024;
    static VIETNAMESE = "vi-VN";
    static TAIWAN = "zh-TW";
}