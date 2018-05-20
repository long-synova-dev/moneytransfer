webpackJsonp([5],{"7XJl":function(e,t){e.exports="/* @media (max-width:1199px)\r\n{\r\n    .btn-addnew\r\n    {\r\n        margin: 20px 0 0 70px;\r\n        margin: 0px;\r\n        float: right !important;\r\n    }\r\n}\r\n@media screen and (min-width: 1200px)\r\n{\r\n    .btn-addnew\r\n    {\r\n        margin: 0px;\r\n        float: right !important;\r\n        margin: 20px 0 0 104px;\r\n    }\r\n    \r\n} */\r\n\r\n.btn-addnew{\r\n    margin: 0px;\r\n    float: right !important;\r\n}\r\n\r\n.align-header-text{\r\n    margin-left: -15px;\r\n    top: 10px;\r\n}\r\n\r\n.ngx-datatable.material {\r\n    -webkit-box-shadow: 0 0 0 0;\r\n            box-shadow: 0 0 0 0;\r\n    }\r\n\r\n.user-info{\r\n    margin-left: 15px;\r\n    padding: 0px;\r\n    top: 20px\r\n    }\r\n"},CoTS:function(e,t){e.exports='<div class="side-container">\r\n    <div class="form-horizontal">\r\n        <div class="form-group">\r\n            <button class="btn-link no-padding" (click)="cancel()">\r\n                <i class="material-icons">arrow_back</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <h2>{{\'Manage.UserManage\' | translate}}</h2>\r\n    <div class="row">\r\n        <div class="col-xs-8">\r\n            <div class="mt20">\r\n                <div class="tab-content">\r\n                    <form action="" [formGroup]="userInfoForm" (ngSubmit)="onSubmit(userInfoForm.value)">\r\n                        <div class="form-group pmd-textfield pmd-textfield-floating-label" [ngClass]="{\r\n                                \'pmd-textfield-floating-label-completed\': userInfoForm.controls[\'firstName\'].value,\r\n                                \'has-error\': userInfoForm.controls[\'firstName\'].invalid && userInfoForm.controls[\'firstName\'].touched\r\n                            }">\r\n                            <label for="FirstName" class="control-label">\r\n                                {{\'SignUp.firstName\' | translate }}*\r\n                            </label>\r\n                            <input maxlength="128" type="text" id="FirstName" class="form-control" [formControl]="userInfoForm.controls[\'firstName\']">\r\n                            <span class="pmd-textfield-focused"></span>\r\n                            <div *ngIf="userInfoForm.controls[\'firstName\'].hasError(\'required\') && userInfoForm.controls[\'firstName\'].touched" class="help-block">\r\n                                {{\'SignUp.firstNameRequired\' | translate}}\r\n                            </div>\r\n                        </div>\r\n                        <div class="form-group pmd-textfield pmd-textfield-floating-label" [ngClass]="{\r\n                                \'pmd-textfield-floating-label-completed\': userInfoForm.controls[\'lastName\'].value,\r\n                                \'has-error\': userInfoForm.controls[\'lastName\'].invalid && userInfoForm.controls[\'lastName\'].touched\r\n                            }">\r\n                            <label for="lastName" class="control-label">\r\n                                {{\'SignUp.lastName\' | translate }}*\r\n                            </label>\r\n                            <input maxlength="128" type="text" id="lastName" class="form-control" [formControl]="userInfoForm.controls[\'lastName\']">\r\n                            <span class="pmd-textfield-focused"></span>\r\n                            <div *ngIf="userInfoForm.controls[\'lastName\'].hasError(\'required\') && userInfoForm.controls[\'lastName\'].touched" class="help-block">\r\n                                {{\'SignUp.lastNameRequired\' | translate}}\r\n                            </div>\r\n                        </div>\r\n                        <div class="form-group pmd-textfield pmd-textfield-floating-label" [ngClass]="{\r\n                            \'pmd-textfield-floating-label-completed\': userInfoForm.controls[\'email\'].value,\r\n                            \'has-error\': userInfoForm.controls[\'email\'].invalid && userInfoForm.controls[\'email\'].touched\r\n                        }">\r\n                            <label for="email" class="control-label">\r\n                                {{\'SignUp.Email\' | translate }}*\r\n                            </label>\r\n                            <input maxlength="128" type="text" id="email" class="form-control" [formControl]="userInfoForm.controls[\'email\']">\r\n                            <span class="pmd-textfield-focused"></span>\r\n                            <div *ngIf="userInfoForm.controls[\'email\'].hasError(\'required\') && userInfoForm.controls[\'email\'].touched" class="help-block">\r\n                                {{\'Login.EmailRequired\' | translate}}\r\n                            </div>\r\n                            <div *ngIf="!userInfoForm.controls[\'email\'].hasError(\'required\') && userInfoForm.controls[\'email\'].hasError(\'pattern\') && userInfoForm.controls[\'email\'].touched"\r\n                                class="help-block">\r\n                                {{\'Login.EmailInvalid\' | translate}}\r\n                            </div>\r\n                        </div>\r\n                        <div class="help-form-group__form">\r\n                            <div class="form-group pmd-textfield pmd-textfield-floating-label" [ngClass]="{\'\r\n                                    pmd-textfield-floating-label-completed\': userInfoForm.controls[\'roleId\'].value,\r\n                                    \'has-error\': userInfoForm.controls[\'roleId\'].invalid && userInfoForm.controls[\'roleId\'].touched\r\n                                }">\r\n                                <label for="roles" class="control-label">\r\n                                    {{\'SignUp.UserRole\' | translate}}*\r\n                                </label>\r\n                                <ng-select formControlName="roleId" [options]="roleList" noFilter="10">\r\n                                </ng-select>\r\n                                <span class="pmd-textfield-focused"></span>\r\n                                <div *ngIf="userInfoForm.controls[\'roleId\'].hasError(\'required\') && userInfoForm.controls[\'roleId\'].touched" class="help-block">\r\n                                    {{\'SignUp.UserRoleRequired\' | translate}}\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class="help-form-group__form">\r\n                            <div class="form-group pmd-textfield pmd-textfield-floating-label" [ngClass]="{\'\r\n                                    pmd-textfield-floating-label-completed\': userInfoForm.controls[\'languageId\'].value,\r\n                                    \'has-error\': userInfoForm.controls[\'languageId\'].invalid && userInfoForm.controls[\'languageId\'].touched\r\n                                }">\r\n                                <label for="roles" class="control-label">\r\n                                    {{\'SignUp.PreferredLang\' | translate}}*\r\n                                </label>\r\n                                <ng-select formControlName="languageId" [options]="langList" noFilter="10">\r\n                                </ng-select>\r\n                                <span class="pmd-textfield-focused"></span>\r\n                                <div *ngIf="userInfoForm.controls[\'languageId\'].hasError(\'required\') && userInfoForm.controls[\'languageId\'].touched" class="help-block">\r\n                                    {{\'SignUp.PreferredLangRequired\' | translate}}\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <div class="help-form-group__form">\r\n                        <div class="form-group">\r\n                            <div class="pmd-switch">\r\n                                <label>\r\n                                    <input type="checkbox" [formControl]="userInfoForm.controls[\'isActive\']">\r\n                                    <span class="pmd-switch-label"></span>\r\n                                </label>\r\n                                <span class="pmd-switch__text">{{\'SignUp.Active\' | translate}}</span>\r\n                            </div>\r\n                        </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class="mt20">\r\n        <button class="btn btn-danger" *ngIf="!isNew" (click)="delete(userId)">{{\'Manage.Delete\' | translate}}</button>\r\n        <button class="btn btn-info" (click)="saveUser(userInfoForm.value)"[disabled]="!userInfoForm.valid" >{{\'Manage.Save\' | translate}}</button>\r\n    </div>\r\n</div>'},G3CI:function(e,t){e.exports='<modal-dialog [(modalDialog)]="confirmDialog">\r\n    <p>{{subscriptionMessage}}</p>\r\n    <div class="pmd-modal-bordered text-right">\r\n        <button class="btn pmd-ripple-effect btn-primary" type="button" (click)="goToSubscription()">OK</button>\r\n    </div>\r\n</modal-dialog>\r\n<modal-dialog [(modalDialog)]="openChangeRoleDialog">\r\n    <p>{{changeRoleMessg}}</p>\r\n    <div class="pmd-modal-bordered text-right">\r\n        <button class="btn pmd-ripple-effect btn-primary" type="button" (click)="changeRole()">OK</button>\r\n    </div>\r\n</modal-dialog>\r\n<div class="container">\r\n    <div class="form-horizontal">\r\n        <div class="form-group">\r\n            <div class="col-xs-8 align-header-text">\r\n                <h1>{{\'Manage.UserManage\' | translate}}</h1>\r\n                <div *ngIf="userStatusInfo">\r\n                    {{\'Manage.LongDescription\' | translate}}\r\n                </div>\r\n            </div>\r\n            <div class="col-xs-4 user-info">\r\n                <div class="panel panel-default" *ngIf="userStatusInfo">\r\n                    <div class="panel-heading">\r\n                        <strong>{{\'Manage.SubscriptionInfo\' | translate}}</strong>\r\n                    </div>\r\n                    <div class="panel-body">\r\n                        <div *ngIf="userStatusInfo && userStatusInfo.plan">\r\n                            <p>\r\n                                <strong>{{\'Manage.PlanName\' | translate}}</strong>: [{{planName}}]</p>\r\n                            <p>\r\n                                <strong>{{\'Manage.UserSeatLeft\' | translate}}</strong>: {{seatLeft}}\r\n                            </p>\r\n                            <p *ngIf="maxUsers == 0">\r\n                                <a (click)="goToBilling()">{{\'Manage.UpgradeYourPlan\' | translate}}</a>\r\n                            </p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="form-group">\r\n            <button type="submit" class="btn btn-primary btn-addnew" (click)="newUser(null)">{{\'Manage.AddNew\' | translate}}</button>\r\n        </div>\r\n    </div>\r\n    <div class="data-table pmd-card pmd-card-default pmd-z-depth">\r\n        <ngx-datatable class="material" [rows]="rows" [columnMode]="\'force\'" [headerHeight]="40" [footerHeight]="40" [rowHeight]="\'auto\'">\r\n            <ngx-datatable-column prop="firstName">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.FirstName\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template>{{value? value : "N/A"}}</ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="lastName">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.LastName\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template>{{value ? value: "N/A"}}</ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="email">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.Email\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template>{{value ? value: "N/A"}}</ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="active">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.Active\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template>\r\n                    <i *ngIf="value" class="material-icons pmd-xs">check_circle</i>\r\n                    <i *ngIf="!value" class="material-icons pmd-xs">highlight_off</i>\r\n                </ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="roleName">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.Roles\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template> {{value}} </ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="createOn">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.CreateOn\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template>\r\n                    {{value? (value | dateformatpipe): "N/A"}}\r\n                </ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="lastLogin">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.LastLogin\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-value="value" ngx-datatable-cell-template>\r\n                    {{value? (value | dateformatpipe): "N/A"}}\r\n                </ng-template>\r\n            </ngx-datatable-column>\r\n            <ngx-datatable-column prop="userId">\r\n                <ng-template ngx-datatable-header-template>\r\n                    <strong>{{\'Manage.Action\' | translate}}</strong>\r\n                </ng-template>\r\n                <ng-template let-row="row" ngx-datatable-cell-template>\r\n                    <i style="cursor: pointer" *ngIf="!row.isAccountOwner" class="material-icons pmd-xs" (click)="edit(row)">edit</i>\r\n                    <i style="cursor: pointer" *ngIf="!row.isAccountOwner" class="material-icons pmd-xs" (click)="sendInvite(row)" title="{{resendInvitation}}" >autorenew</i>\r\n                    <i style="cursor: pointer" *ngIf="isCanAssignAsOwner(row)" class="material-icons pmd-xs" title="{{changeOwnership}}" (click)="openChangeRolePopup(row)">people</i>\r\n                </ng-template>\r\n            </ngx-datatable-column>\r\n        </ngx-datatable>\r\n\r\n\r\n    </div>\r\n</div>\r\n<router-outlet></router-outlet>'},Mfqp:function(e,t){e.exports=".side-container\r\n{\r\n    position: absolute;\r\n    z-index: 9;\r\n    top: 0;\r\n    right: 0;\r\n    height: 100%;\r\n    overflow: auto;\r\n    background: #fff;\r\n    padding: 20px;\r\n    border-left: 1px solid #e0e0e0;\r\n    \r\n}\r\n.tab-content{\r\n    width: 470px;\r\n}"},emoU:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("Xjw4"),a=n("WT6e"),o=n("bfOx"),l=n("8A5H"),s=n("ZKJB"),i=n("lYsT"),c=n("fln1"),d=n("Ot1C"),u=n("3Bd6"),p=this&&this.__decorate||function(e,t,n,r){var a,o=arguments.length,l=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(o<3?a(l):o>3?a(t,n,l):a(t,n))||l);return o>3&&l&&Object.defineProperty(t,n,l),l},m=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},g=function(){function e(e,t,n,r,a,o,l){this._router=e,this._activatedRoute=t,this._userService=n,this._commonService=r,this._alertService=a,this._translate=o,this._data=l,this.rows=[],this.selected=[],this.deleteConfirm=new u.a("Confirm Delete","modal-md",!1),this.confirmDialog=new u.a("Notification","modal-md",!1),this.openChangeRoleDialog=new u.a("Notification","modal-md",!1)}return e.prototype.ngOnInit=function(){var e=this._data.getDefaultLanguage();this._translate.setDefaultLang(e),this._loadData(),this._waitForPopupClosed()},e.prototype._waitForPopupClosed=function(){var e=this;this._commonService.isClosed.subscribe(function(t){t&&(e.ngOnInit(),e._commonService.isPopupClosed(!1))})},e.prototype._loadData=function(){var e=this;this._data.currentUser.subscribe(function(t){e.currUser=t}),this._data.changeLoadStatus(!0),this._userService.getAllUser().then(function(t){e.rows=t,e.rows.forEach(function(t){t.isAccountOwner="AccountOwner"==t.roleName,e._translate.get("Manage."+t.roleName).subscribe(function(e){t.roleName=e}),e._translate.get("Manage.ResendInvitation").subscribe(function(t){e.resendInvitation=t}),e._translate.get("Manage.ChangeOwnershipMessage").subscribe(function(t){e.changeRoleMessg=t}),e._translate.get("Manage.ChangeOwnership").subscribe(function(t){e.changeOwnership=t})}),e._userService.GetUserStatus().then(function(t){if(e._data.changeLoadStatus(!1),e.userStatusInfo=t,t.plan){var n=e.rows.filter(function(e){return e.active}).length,r="Manage."+t.plan.planName;"NoPlanSelected"!=t.plan.planName?(e.planName=t.plan.planName,e.maxUsers=t.plan.maximumUser-n,e.seatLeft=e.maxUsers+" / "+t.plan.maximumUser):(e._translate.get(""+r).subscribe(function(t){e.planName=t}),e.seatLeft=n+" / ?")}t.isAddNew||e._translate.get("Manage.MaximumNumberError").subscribe(function(t){e.subscriptionMessage=t})})})},e.prototype.goToBilling=function(){window.location.href="/billing-plan"},e.prototype.newUser=function(e){e||(e="00000000-0000-0000-0000-000000000000",this._userService.setSharedUserId(e)),this.userStatusInfo.isAddNew?this._router.navigate(["user-manage","new"]):this.confirmDialog.visible=!0},e.prototype.edit=function(e){this._userService.setSharedUserId(e.userId),this._router.navigate(["user-manage","edit"])},e.prototype.sendInvite=function(e){var t=this;this._data.changeLoadStatus(!0),this._userService.sendInvitation(e).then(function(e){t._data.changeLoadStatus(!1),t._translate.get("ResetPass.SendInSuccess").subscribe(function(e){return t._alertService.success(e)})})},e.prototype.openChangeRolePopup=function(e){this.userId=e.userId,this.openChangeRoleDialog.visible=!0},e.prototype.changeRole=function(){var e=this;this._userService.changeRole(this.userId).then(function(t){""==t.error?(e._translate.get("Manage.ChangeOwnershipSuccess").subscribe(function(t){e._alertService.success(t)}),localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),e._router.navigate(["/account"])):(e._translate.get("Manage."+t.error).subscribe(function(t){e._alertService.error(t)}),e.openChangeRoleDialog.visible=!1)})},e.prototype.getUserStatus=function(){var e=this;this._userService.GetUserStatus().then(function(t){e.userStatusInfo=t,t.plan&&(e.maxUsers=t.plan.maximumUser),t.isAddNew||e._translate.get("Manage.UnableToAddUsers").subscribe(function(t){console.log(t),e.subscriptionMessage=t})})},e.prototype.isCanAssignAsOwner=function(e){if(this.currUser.roles.includes("R2")&&!e.isAccountOwner)return!0},e.prototype.goToSubscription=function(){this._router.navigate(["billing-plan"])},p([Object(a.ViewChild)("editTmpl"),m("design:type",a.TemplateRef)],e.prototype,"editTmpl",void 0),p([Object(a.ViewChild)("activeTmpl"),m("design:type",a.TemplateRef)],e.prototype,"activeTmpl",void 0),p([Object(a.ViewChild)("createOnTmpl"),m("design:type",a.TemplateRef)],e.prototype,"createOnTmpl",void 0),e=p([Object(a.Component)({template:n("G3CI"),styles:[n("7XJl")]}),m("design:paramtypes",[o.Router,o.ActivatedRoute,s.a,d.a,c.a,l.c,i.a])],e)}(),f=n("hvaS"),h=n("byKF"),v=n("7DMc"),b=this&&this.__decorate||function(e,t,n,r){var a,o=arguments.length,l=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(o<3?a(l):o>3?a(t,n,l):a(t,n))||l);return o>3&&l&&Object.defineProperty(t,n,l),l},I=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},x=function(){function e(e,t,n,r,a,o,l,s){this._activatedRoute=e,this._data=t,this._commonService=n,this._router=r,this._userService=a,this._formBuilder=o,this._translate=l,this._alert=s,this.deleteConfirm=new u.a("Confirm Delete","modal-md",!1),this.confirmDialog=new u.a("Notification","modal-md",!1)}return e.prototype.ngOnInit=function(){var e=this;this.userId=this._userService.getSharedUserId(),this.userId||(this.userId="00000000-0000-0000-0000-000000000000"),this._userService.getRoles().then(function(t){(t=t.filter(function(e){return"AccountOwner"!=e.label})).forEach(function(t){e._translate.get("Manage."+t.label).subscribe(function(e){t.label=e})}),e.roleList=t}),this._userService.getLanguages().then(function(t){e.langList=t.map(function(e){return{value:e.languageId.toString(),label:e.languageName}})}),this._userService.getUserById(this.userId).then(function(t){t.languageId=t.languageId?t.languageId.toString():null,e.userModel=t,e.isNew=t.isNew,e.formInit(e.userModel)}),this.formInit(this.userModel)},e.prototype.formInit=function(e){this.userInfoForm=this._formBuilder.group({id:[e&&e.id],firstName:[e&&e.firstName?e.firstName:null,v.Validators.required],lastName:[e&&e.lastName?e.lastName:null,v.Validators.required],email:[e&&e.email?e.email:null,v.Validators.compose([v.Validators.required,v.Validators.pattern(h.a.EMAIL_REGEX_VALIDATE)])],roleId:[e&&e.roleId?e.roleId:null,v.Validators.required],languageId:[e&&e.languageId?e.languageId:null,v.Validators.required],isActive:[!(!e||!e.isActive)&&e.isActive]})},e.prototype.cancel=function(){this._router.navigate(["user-manage"])},e.prototype.delete=function(e){var t=this;this._userService.deleteUser(e).then(function(e){e?(t._alert.success("Deleted sucessfully."),t.deleteConfirm.visible=!1,t._commonService.isPopupClosed(!0),t.cancel()):t._alert.error("Deleted un-sucessfully.Please make sure delete all its children.")})},e.prototype.saveUser=function(e){var t=this;return this._data.changeLoadStatus(!0),new Promise(function(n,r){t._userService.saveUser(e).then(function(e){if("SignUp.SavedSucess"==e.result)return t._translate.get(e.result).subscribe(function(e){return t._alert.success(e)}),t._commonService.isPopupClosed(!0),t.cancel(),n();t._translate.get(e.result).subscribe(function(e){return t._alert.error(e)}),t._data.changeLoadStatus(!1)})})},e.prototype.onSubmit=function(e){var t=this;this.userInfoForm.valid&&this.saveUser(e).then(function(e){t._router.navigate(["account","manage"])})},e=b([Object(a.Component)({template:n("CoTS"),styles:[n("Mfqp")],animations:[Object(f.a)()],host:{"[@slideInOutTransition]":""}}),I("design:paramtypes",[o.ActivatedRoute,i.a,d.a,o.Router,s.a,v.FormBuilder,l.c,c.a])],e)}(),_=[{path:"",component:g,children:[{path:"edit",component:x},{path:"new",component:x}]}],S=o.RouterModule.forChild(_),w=n("ZIaS"),y=n("ItHS"),N=n("fYrX"),M=n("obU/"),F=n("oHSm"),R=n("8Gd/");n.d(t,"UserManageModule",function(){return U}),t.HttpLoaderFactory=O;var C=this&&this.__decorate||function(e,t,n,r){var a,o=arguments.length,l=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(o<3?a(l):o>3?a(t,n,l):a(t,n))||l);return o>3&&l&&Object.defineProperty(t,n,l),l},U=function(){function e(){}return e=C([Object(a.NgModule)({imports:[r.CommonModule,S,v.FormsModule,w.a,v.ReactiveFormsModule,l.b.forChild({loader:{provide:l.a,useFactory:O,deps:[y.HttpClient]},isolate:!0}),N.a,F.NgxDatatableModule,R.a],declarations:[g,x],providers:[d.a]})],e)}();function O(e){return new M.a(e,"/assets/i18n/","-user.json")}}});