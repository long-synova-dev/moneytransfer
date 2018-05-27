import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        private _http: HttpClient
    ) { }

    private _sharedUserId: any;
    public setSharedUserId(id) {
        this._sharedUserId = id;
    }
    public getSharedUserId() {
        return this._sharedUserId;
    }
    private _shareReturnUrl = new Subject<string>();
    getShareUrl = this._shareReturnUrl.asObservable();
    public setShareReturnUrl(url) {
        this._shareReturnUrl.next(url);
        console.log(this.getShareUrl);
    }

    public getTokenService(user: any) {
        return this._http
            .post(Globals.GET_TOKEN_DATA_URL, JSON.stringify(user))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public createAccountService(user: any) {
        return this._http
            .post(Globals.REGISTER_DATA_URL, JSON.stringify(user))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public getCurrentUser() {
        return this._http
            .get(Globals.GET_CURRENT_USER_DATA_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public userLogout() {
        return this._http
            .post(Globals.CLEAN_TOKEN_DATA_URL, null)
            .toPromise()
            .then()
            .catch();
    }

    public getLanguages() {
        return this._http
            .get(Globals.GET_LANGUAGES_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public changeLanguage(languageId: number) {
        return this._http
            .post(Globals.CHANGE_LANGUAGE_URL, { languageId: languageId })
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public forgotPassword(email: any) {
        return this._http
            .post(Globals.FORGOT_PASSWORD_URL, email)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public resetPassword(value) {
        return this._http
            .post(Globals.RESET_PASSWORD_URL, value)
            .toPromise()
            .then(response => response)
    }

    public confirmSignup(value) {
        return this._http
            .post(Globals.CONFIRM_SIGNUP_URL, value)
            .toPromise()
            .then(response => response);
    }

    public getAllUser(page) {
        return this._http
        .get(`${Globals.GET_ALL_USER_URL}?keyword=${page.keyword}&PageNumber=${page.pageNumber}&ItemsPerPage=${page.itemsPerPage}&OrderBy=${page.orderBy}&IsDesc=${page.isDesc}`)
        .toPromise()
        .then(response => response);
    }

    public saveUser(user: any) {
        return this._http.post(Globals.SAVE_USER_URL,user).toPromise().then(response => response).catch(this.handleError);
    }

    public deleteUser(id) {
        return this._http.delete(`${Globals.DELETE_USER_URL}/${id}`).toPromise().then(response => response).catch(this.handleError);
    }

    public getRoles() {
        return this._http.get(Globals.GET_ROLES_URL).toPromise().then(response => response).catch(this.handleError);
    }

    public getUserById(id){
        return this._http
        .get(`${Globals.GET_USER_BY_ID_URL}/${id}`)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    public updateBasicUserInfo(info) {
        return this._http
            .post(Globals.UPDATE_USER_BASIC_INFO_URL, info)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public updatePassword(pass) {
        return this._http
            .post(Globals.CHANGE_PASSWORD_URL, pass)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public sendInvitation(user){
        return this._http
        .post(Globals.RESEND_INVITATION,user)
        .toPromise()
        .then(response=> response)
        .catch(this.handleError);
    }
    
    public changeRole(userId)
    {
        return this._http
        .post(`${Globals.CHANGE_ROLE_URL}/${userId}`,{})
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    public resendEmailConfirm(user)
    {
        return this._http
        .post(Globals.RESEND_EMAIL_CONFIRM_URL, user)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}
