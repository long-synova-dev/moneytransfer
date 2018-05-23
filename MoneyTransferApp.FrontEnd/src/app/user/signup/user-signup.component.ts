import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../shared/services/user.service';
import { MatchPasswordValidation } from '../../shared/services/match-password.service';
import { Globals } from '../../shared/global/global';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../shared/services/alert.service';
import { Intercom } from 'ng-intercom';
import { ModalDialog } from '../../shared/models/modal-dialog.model';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './user-signup.component.html',
    styleUrls: ['../user.component.css']
})

export class UserSignupComponent implements OnInit {
    signupForm: FormGroup;
    errorMessenger: string[];
    listVats;
    isDK = false;
    successModal: ModalDialog;

    constructor(
        private _data: DataService,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _router: Router,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _intercom: Intercom
    ) {
        this.signupForm = _formBuilder.group({
            'firstName': [null, Validators.required],
            'lastName': [null, Validators.required],
            'companyName': [null, Validators.required],
            'phoneNumber': [null, Validators.required],
            'email': [null, Validators.compose([Validators.required, Validators.pattern(Globals.EMAIL_REGEX_VALIDATE)])],
            'password': [null, Validators.compose([Validators.required, Validators.pattern(Globals.PASSWORD_REGEX_VALIDATE)])],
            'confirmPassword': [null, Validators.compose([Validators.required])],
            'acceptedPolicy': [null, Validators.requiredTrue],
            'languageId': [null],
            'countryVatCode': [null, Validators.required],
            'vatRegistrationNo': [null, Validators.required],
        }, {
                validator: MatchPasswordValidation.MatchPassword
            });
        this.successModal = new ModalDialog('SignUp Success', 'modal-md', false);
    }
    ngOnInit(): void {
        let lang = localStorage.getItem("lang");
        if(JSON.parse(lang).languageCode == 'da-DK')
        {
            this.isDK = true;
        }
    }

    shutdownChat() {
        this._intercom.shutdown();
    }
    startChat() {
        this._intercom.show();
    }

    gotoPolicy()
    {
        
    }

    onSubmit(user: User) {
        this._data.changeLoadStatus(true)

        //Set language Id if any
        let lang = localStorage.getItem("lang");
        let preferredLangId;
        if (lang) {
            preferredLangId = JSON.parse(localStorage.getItem("lang")).languageId;
        }
        user.languageId = preferredLangId;

        console.log(user);
        //Call api
        this._userService.createAccountService(user)
            .then((response) => {
                if (response && response.errors && response.errors.length > 0) {
                    this._data.changeLoadStatus(false);
                    this.errorMessenger = [];
                    if(!response.isExisted)
                    {
                        response.errors.forEach(err => {
                            this._translate.get(`SignUp.${err}`).subscribe(value => this.errorMessenger.push(value));
                        });
                    }
                    else
                    {
                        this._translate.get(`SignUp.AccountOwnerExisted`).subscribe(value => this.errorMessenger.push(value));
                    }
                    
                } else {
                    this._data.changeLoadStatus(false);
                    this._translate.get('SignUp.SuccessSignUpModal').subscribe(value => this.successModal = new ModalDialog(value, 'modal-md', false));
                    this.successModal.visible = true;
                }
            });
        }
    goLogin() {
        this._router.navigate(['/account'])
    }
}