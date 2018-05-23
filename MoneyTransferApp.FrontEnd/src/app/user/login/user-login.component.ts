import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Rx';

import { Globals } from '../../shared/global/global';
import { UserService } from '../../shared/services/user.service';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../shared/services/alert.service';
import { ModalDialog } from '../../shared/models/modal-dialog.model';
import { ModalComponent } from '../../shared/directives/modal.component';
import { CompanyInfoService } from '../../shared/services/company-info.service';
import { Intercom } from 'ng-intercom';

@Component({
    templateUrl: './user-login.component.html',
    styleUrls: ['../user.component.css']
})

export class UserLoginComponent implements OnInit {

    loginForm: FormGroup;
    errorMessenger: string[];
    confirmDialog: ModalDialog;
    subscriptionMessage;
    redirectTo;
    resendEmail: boolean;
    lang: string;
    isOpenMobileAlert: boolean = false;
    isRememberMe;
    returnUrl;

    constructor(
        private _UserService: UserService,
        private _router: Router,
        private _activatedRouter: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _data: DataService,
        private _alert: AlertService,
        private _companyInfoService: CompanyInfoService,
        private _intercom: Intercom
    ) {
        this._translate.get('Login.NotificationTitle').subscribe(value => this.confirmDialog = new ModalDialog(value, 'modal-md', false));
    }
    ngOnInit() {
        //this._UserService.checkRestrictIP();
        this.userLogout();
        this._data.updateActiveToken(false);
        
        let checkIsRemember = localStorage.getItem('isRememberMe');
        if (checkIsRemember) {
            this.isRememberMe = true;
            let rememberValue = {};
            rememberValue['userName'] = localStorage.getItem('userName');
            rememberValue['email'] = localStorage.getItem('email');
            this.formInit(rememberValue);
        } else {
            this.formInit(null);
        }
        // returnUrl
        this.returnUrl = this._activatedRouter.snapshot.queryParams['returnUrl'] || '/';
    }
    formInit(value) {
        this.loginForm = this._formBuilder.group({
            'userName': [value && value.userName ? value.userName : null, Validators.required],
            //'email': [value && value.email ? value.email : null, Validators.compose([Validators.required, Validators.pattern(Globals.EMAIL_REGEX_VALIDATE)])],
            'password': [null, Validators.required]
        });
    }
    userLogout() {
        if (localStorage.getItem('accessToken')) {
            this._UserService.userLogout()
                .then(() => this.clearStorageAndBackToLogin())
                .catch(() => this.clearStorageAndBackToLogin());
        }
    }

    clearStorageAndBackToLogin() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.reload();
    }

    startChat() {
        this._intercom.show();
    }

    onSubmit(loginInfo) {
        let deviceWidth = document.documentElement.clientWidth;
        if (deviceWidth < 750 ) {
            this.isOpenMobileAlert = true;
            return;
        }
        this._data.changeLoadStatus(true);
        console.log(loginInfo);
        this._UserService.getTokenService(loginInfo)
            .then((response) => {
                console.log("aaaaaaaaaaa");
                console.log(response);
                // return error
                if (response && response.errors && response.errors.length > 0) {
                    this._data.changeLoadStatus(false);
                    this.errorMessenger = [];
                    response.errors.forEach(err => {
                        this._translate.get(`Login.${err}`).subscribe(value => this.errorMessenger.push(value));

                        if (err === 'EmailNotConfirmed') {
                            this.resendEmail = true;
                        }
                    });
                }
                // login success
                else {
                    this.isRememberMeCheck(this.isRememberMe);
                    
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('expireAt', response.expireAt);
                    localStorage.setItem('issueAt', response.issueAt);
                    localStorage.setItem('plan', response.plan);
                    localStorage.setItem('refreshToken', response.refreshToken);
                    localStorage.setItem('roles', response.roles);
                    localStorage.setItem('sessionTime', response.sessionTime);

                    this._data.changeLoadStatus(false);
                    this._UserService.getCurrentUser()
                        .then(response => {
                            localStorage.setItem("lang", JSON.stringify({ languageId: response.language, languageCode: response.locale }));
                        });

                    this._companyInfoService.isGdprProgramGenerated()
                        .then(value => {
                            this._data.setGdprProgramGenerated(value);
                            if (response.inTrial || response.state === 'active') {
                                if (value.isGenerated) {
                                    this._router.navigate([this.returnUrl]);
                                } else {
                                    this._router.navigate(['/gdpr-wizard']);
                                }
                            } else {
                                if (response.roles.indexOf("R2") > -1 || response.roles.indexOf("R3") > -1) {
                                    if (response.state === 'no_subscription') {
                                        this._translate.get(`Login.${response.state}`).subscribe(value => this.subscriptionMessage = value);
                                        this.redirectTo = '/billing-plan';
                                    } else {
                                        this._translate.get(`Login.${response.state}`).subscribe(value => this.subscriptionMessage = value);
                                        this.redirectTo = '/billing-plan/current';
                                    }
                                } else {
                                    this._translate.get(`Login.SubsriptionExpiredForPerformerReviewer`).subscribe(value => this.subscriptionMessage = value);
                                }
                                this._translate.get('Login.NotificationTitle').subscribe(value => this.confirmDialog = new ModalDialog(value, 'modal-md', false));
                                this.confirmDialog.visible = true;
                            }
                        });
                }
            })
    }

    goToSubscription() {
        window.location.href = this.redirectTo;
    }
    
    closeMoblieAlert() {
        this.isOpenMobileAlert = false;
    }
    
    isRememberMeCheck(isMember) {
        if (isMember) {
            localStorage.setItem('isRememberMe', this.isRememberMe);
            localStorage.setItem('companyNumber', this.loginForm.value.companyNumber);
            localStorage.setItem('email', this.loginForm.value.email);
        } else {
            localStorage.removeItem('isRememberMe');
            localStorage.removeItem('companyNumber');
            localStorage.removeItem('email');
        }
    }

    resendEmailConfirm(loginInfo)
    {
        this._UserService.resendEmailConfirm(loginInfo).then(response =>{
            if (response.message == "Success")
            {
                this.resendEmail = false;
                this._translate.get('Login.ResendEmailSuccess').subscribe(value => this._alert.success(value));
            }
            else
            {
                this._translate.get('Login.ResendEmailFailed').subscribe(value => this._alert.error(value));
            }
        });
    }
}