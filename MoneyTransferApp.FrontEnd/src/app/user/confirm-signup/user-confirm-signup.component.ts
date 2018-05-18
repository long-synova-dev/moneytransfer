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
    templateUrl: './user-confirm-signup.component.html',
    styleUrls: ['../user.component.css']
})

export class UserConfirmSignUpComponent implements OnInit {
    userInfo;
    status = 'Verifying';
    isSuccess = false;
    model: any;
    constructor(
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
            this.model = { email: params.u, code: params.p, companyNumber: params.c };
            this.confirmSignup(this.model);
        });
    }

    confirmSignup(data) {
        this._userService.confirmSignup(data)
            .then(response => {
                var model: any = response;
                if(model.message == "Success")
                {
                    this.isSuccess = true;
                    this._translate.get(`Manage.Success`).subscribe(s=>{
                        model.show ? this._alert.success(s) : null;
                        this.status = s;
                    });
                }
                else if(model.error == "InvalidToken")
                {
                    this._translate.get(`Login.InvalidToken`).subscribe(s=>{
                        model.show ? this._alert.error(s) : null;
                        this.status = s;
                    });
                }
                else
                {
                    this._translate.get(`Manage.Failed`).subscribe(s=>{
                        model.show ? this._alert.success(s) : null;
                        this.status = s;
                    });
                }
            });
    }
}