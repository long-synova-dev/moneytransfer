import { Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../shared/global/global';
import { DataService } from '../shared/services/data.service';
import { UserService } from '../shared/services/user.service';
import { MatchPasswordValidation } from '../shared/services/match-password.service';
import { AlertService } from '../shared/services/alert.service';
import { IOption } from 'ng-select';

@Component({
    templateUrl: './user-setting.component.html'
})

export class UserSettingComponent implements OnInit {

    basicForm: FormGroup;
    securityForm: FormGroup;
    ready: boolean = false;
    listLang;
    defineLanguage: IOption;
    seletedLang;

    constructor(
        private _data: DataService,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _userService: UserService,
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        let currentUserID = localStorage.getItem('uid');
        this._userService.getLanguages()
            .then(response => {
                this.listLang = response;
                this.defineLanguage = this._convertResponseToOptions(response);
            })
        this._userService.getUserById(currentUserID)
            .then(response => {
                this.formInit(response);
                this.ready = true;
            });
    }

    formInit(data) {
        console.log(data);
        this.seletedLang = data.languageId.toString();
        this.basicFormInit(data);
        this.securityFormInit();
    }

    basicFormInit(data) {
        this.basicForm = this._formBuilder.group({
            'firstName': [data && data.firstName ? data.firstName : null, Validators.required],
            'lastName': [data && data.lastName ? data.lastName : null, Validators.required],
            'phone': [data && data.phoneNumber ? data.phoneNumber : null, Validators.required],
            'email': [data && data.email ? data.email : null, Validators.required]
        });
    }

    securityFormInit() {
        this.securityForm = this._formBuilder.group({
            'oldPassword': [null, Validators.required],
            'password': [null, Validators.compose([Validators.required, Validators.pattern(Globals.PASSWORD_REGEX_VALIDATE)])],
            'confirmPassword': [null, Validators.compose([Validators.required])]
        },{
            validator: MatchPasswordValidation.MatchPassword
        });
    }

    setingFormInit() {
        this._data.changeLoadStatus(true);
        this._userService.changeLanguage(Number(this.seletedLang))
            .then(response => {
                this._data.changeLoadStatus(false);
                let lang = this.listLang.filter(item => item.languageId == Number(this.seletedLang))
                localStorage.setItem("lang", JSON.stringify(lang[0]));
                window.location.reload();
            })
    }

    basicFormSubmit(data) {
        this._data.changeLoadStatus(true);
        this._userService.updateBasicUserInfo(data)
            .then(response => {
                if (response.errors == "") {
                    this._translate.get('Success.SaveSuccess').subscribe(value => this._alert.success(value));
                } else {
                    this._translate.get(response.errors).subscribe(value => this._alert.success(value));
                }
                this._data.changeLoadStatus(false);
            })
    }

    securityFormSubmit(data) {
        let cloneData = {};
        cloneData['oldPassword'] = data.oldPassword;
        cloneData['newPassword'] = data.password;
        this._data.changeLoadStatus(true);
        this._userService.updatePassword(cloneData)
            .then(response => {
                if (response.errors == "") {
                    this._translate.get('Success.SaveSuccess').subscribe(value => this._alert.success(value));
                } else {
                    this._translate.get(response.errors).subscribe(value => this._alert.success(value));
                }
                this._data.changeLoadStatus(false);
            })
    }

    private _convertResponseToOptions(data) {
        var mapped = data.map(item => {
            return {
                label: item.languageName,
                value: item.languageId.toString()
            }
        });

        return mapped;
    }

}
