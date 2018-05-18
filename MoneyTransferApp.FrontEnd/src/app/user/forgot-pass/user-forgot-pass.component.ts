import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Globals } from '../../shared/global/global';
import { UserService } from '../../shared/services/user.service';
import { AlertService } from '../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms/src/model';
import { Intercom } from 'ng-intercom';
import { Router } from '@angular/router';

@Component({
    templateUrl: './user-forgot-pass.component.html',
    styleUrls: ['../user.component.css']
})

export class UserForgotPassComponent {
    resetForm: FormGroup;
    errorMessenger;

    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _alert: AlertService,
        private _translate: TranslateService,
        private _intercom: Intercom,
        private _router: Router
    ) {
        this.resetForm = _formBuilder.group({
            'email': [null, Validators.compose([Validators.required, Validators.pattern(Globals.EMAIL_REGEX_VALIDATE)])]
        })
    }

    shutdownChat() {
        this._intercom.shutdown();
    }
    startChat() {
        this._intercom.show();
    }

    onSubmit(value) {
        console.log(value);
        let lang = localStorage.getItem("lang");
        let preferredLangId;
        if (lang) {
            preferredLangId = JSON.parse(localStorage.getItem("lang")).languageId;
        }
        value.languageId = preferredLangId;
        this._userService.forgotPassword(value)
            .then((response) => {
                if(response.message == "Success")
                {
                    this._translate.get('ResetPass.Success').subscribe(value => this._alert.success(value, null, true, true));
                    this._router.navigate(["account","login"]);
                }
                else
                {
                    this._translate.get('ResetPass.EmailNoExist').subscribe(value => this._alert.error(value, null, true, true));
                }
            })
    }
}