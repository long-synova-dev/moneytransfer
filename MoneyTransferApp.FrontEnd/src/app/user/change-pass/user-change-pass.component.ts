import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Globals } from '../../shared/global/global';
import { MatchPasswordValidation } from '../../shared/services/match-password.service';
import { UserService } from '../../shared/services/user.service';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './user-change-pass.component.html',
    styleUrls: ['../user.component.css']
})

export class UserChangePassComponent implements OnInit {
    changePassForm: FormGroup;
    errorMessenger;
    userInfo;
    resetPass: any;
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _data: DataService,
        private _alert: AlertService,
        private _translate: TranslateService
    ) {}

    ngOnInit() {
        this._activatedRoute.queryParams.subscribe((params: Params) => {
            this.userInfo = params;
            this.formInit(params);
        });
    }

    formInit(data) {
        this.changePassForm = this._formBuilder.group({
            'email': [data.u],
            'code': [data.p],
            'password': [null, Validators.compose([Validators.required, Validators.pattern(Globals.PASSWORD_REGEX_VALIDATE)])],
            'confirmPassword': [null, Validators.compose([Validators.required])],
            'companyNumber': [data.c]
        },{
            validator: MatchPasswordValidation.MatchPassword
        });
    }

    onSubmit(value) {
        this._data.changeLoadStatus(true);
        this._userService.resetPassword(value)
                        .then(response => {
                            this._data.changeLoadStatus(false);
                            this.resetPass = response;
                            if(this.resetPass.message == "ResetPass.Success")
                            {
                                this._translate.get('ResetPass.Success').subscribe(value => this._alert.success(value, null, true, true));
                                this._router.navigate(["account","login"]);
                            }
                            else
                            {
                                this._translate.get('ResetPass.ChangePassFailed').subscribe(value => this._alert.error(value, null, true, true));
                            }

                        });
    }
}