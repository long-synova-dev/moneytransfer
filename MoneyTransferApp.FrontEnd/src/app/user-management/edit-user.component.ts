import { Component } from '@angular/core';
import { IOption } from 'ng-select';
import { slideInOutTransition } from '../animations/slide-transition';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AlertService } from '../shared/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../shared/global/global';
import { CommonService } from '../shared/services/common.service';
import { UserService } from '../shared/services/user.service';
import { SelectModule } from 'ng-select';
import { ModalDialog } from '../shared/models/modal-dialog.model';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { promise } from 'selenium-webdriver';
import { resolve } from 'url';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';

@Component({
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css'],
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' },

})

export class UserEditComponent implements OnInit {

    userId;
    userModel;
    roleList: Array<IOption>;
    langList: Array<IOption>;
    deleteConfirm: ModalDialog;
    userInfoForm: FormGroup;
    isNew: boolean;
    userInfo: any;
    confirmDialog: ModalDialog;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _data: DataService,
        private _commonService: CommonService,
        private _router: Router,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _alert: AlertService
        
    ) {
        this.deleteConfirm = new ModalDialog("Confirm Delete", "modal-md", false);
        this.confirmDialog = new ModalDialog("Notification", "modal-md", false);

    }
    ngOnInit() {

        this.userId = this._userService.getSharedUserId();

        if (!this.userId) {
            this.userId = "00000000-0000-0000-0000-000000000000";
        }
        this._userService.getRoles().then(data => {
           data = data.filter(s=>s.label != "AccountOwner");
            data.forEach(element => {
                this._translate.get(`Manage.${element.label}`).subscribe(v=>{
                    element.label = v;
                });
            });
            this.roleList = data;
        });
        this._userService.getLanguages().then(data => {
            this.langList = data.map(item => {
                return {
                    value: item.languageId.toString(),
                    label: item.languageName
                }
            });
        });

        this._userService.getUserById(this.userId).then(response => {
            response.languageId = response.languageId ? response.languageId.toString(): null
            this.userModel = response;
            this.isNew = response.isNew;
            this.formInit(this.userModel);
        });
        this.formInit(this.userModel);
    }

    formInit(data) {
        this.userInfoForm = this._formBuilder.group({
            'id': [data && data.id],
            'firstName': [data && data.firstName ? data.firstName : null, Validators.required],
            'lastName': [data && data.lastName ? data.lastName : null, Validators.required],
            'email': [data && data.email ? data.email : null, Validators.compose([Validators.required, Validators.pattern(Globals.EMAIL_REGEX_VALIDATE)])],
            'roleId': [data && data.roleId ? data.roleId : null, Validators.required],
            'languageId': [data && data.languageId ? data.languageId : null, Validators.required],
            "isActive": [data && data.isActive ? data.isActive:false]
        });
    }

    cancel() {
        this._router.navigate(['user-manage']);
    }

    delete(id) {
        this._userService.deleteUser(id)
        .then(response => {
            if (response) {
                this._alert.success("Deleted sucessfully.");
                this.deleteConfirm.visible = false;
                this._commonService.isPopupClosed(true);
                this.cancel();
            } else {
                this._alert.error("Deleted un-sucessfully.Please make sure delete all its children.");
            }
        });
    }

    saveUser(value): Promise<any> {
   
        this._data.changeLoadStatus(true);        
        let def = new Promise((resolve,reject)=>{
            this._userService.saveUser(value).then(s=>
            {
                if(s.result != "SignUp.SavedSucess")
                {
                    this._translate.get(s.result).subscribe(value => this._alert.error(value));
                }
                else
                {
                    this._translate.get(s.result).subscribe(value => this._alert.success(value));
                    this._commonService.isPopupClosed(true);
                    this.cancel();
                    return resolve();
                }
                this._data.changeLoadStatus(false);
            })
        });
        return def;
    }

    
    onSubmit(value)
    {
        if(this.userInfoForm.valid)
        {
            this.saveUser(value).then(s=>{
                this._router.navigate(['account', 'manage']);
            });
        }
    }

    
}