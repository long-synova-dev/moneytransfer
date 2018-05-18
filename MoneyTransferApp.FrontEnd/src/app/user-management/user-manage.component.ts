import { Component, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
import { MatchPasswordValidation } from '../shared/services/match-password.service';
import { Globals } from '../shared/global/global';
import { DataService } from '../shared/services/data.service';
import { AlertService } from '../shared/services/alert.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { ModalDialog } from '../shared/models/modal-dialog.model';

@Component({
    templateUrl: './user-manage.component.html',
    styleUrls: ['./user-manage.component.css']
})


export class UserManageComponent implements OnInit {
    maxUsers;
    rows: any = [];
    userStatusInfo: any;
    subscriptionMessage: string;

    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('activeTmpl') activeTmpl: TemplateRef<any>;
    @ViewChild('createOnTmpl') createOnTmpl: TemplateRef<any>;
    selected = [];
    deleteConfirm: ModalDialog;
    confirmDialog: ModalDialog;
    openChangeRoleDialog: ModalDialog;
    planName: string;
    seatLeft: string;
    resendInvitation: string;
    changeRoleMessg: string;
    changeOwnership: string;
    userId: any;
    currUser: any;
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _userService: UserService,
        private _commonService: CommonService,
        private _alertService: AlertService,
        private _translate: TranslateService,
        private _data: DataService

    ) {
        this.deleteConfirm = new ModalDialog("Confirm Delete", "modal-md", false);
        this.confirmDialog = new ModalDialog("Notification", "modal-md", false);
        this.openChangeRoleDialog = new ModalDialog("Notification", "modal-md", false);
    }

    ngOnInit() {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
        //  this.getUserStatus();
        this._loadData();
        this._waitForPopupClosed();
    }

    _waitForPopupClosed() {
        this._commonService.isClosed.subscribe(closed => {
            if (closed) {

                this.ngOnInit();
                this._commonService.isPopupClosed(false);
            }
        });
    }

    _loadData() {
        this._data.currentUser.subscribe(info => {
            this.currUser = info;
        });
        this._data.changeLoadStatus(true);
        this._userService.getAllUser()
            .then(data => {
                this.rows = data;
                this.rows.forEach((element) => {
                    element.isAccountOwner = element.roleName == "AccountOwner";
                    //if(element.isAccountOwner && element.userId == this._data.currentUser)
                    this._translate.get(`Manage.${element.roleName}`).subscribe(v => {
                        element.roleName = v;
                    });
                    this._translate.get(`Manage.ResendInvitation`).subscribe(v => {
                        this.resendInvitation = v;
                     });
                     this._translate.get(`Manage.ChangeOwnershipMessage`).subscribe(v => {
                        this.changeRoleMessg = v;
                     });
                     this._translate.get(`Manage.ChangeOwnership`).subscribe(v => {
                        this.changeOwnership = v;
                     });
                });
                this._userService.GetUserStatus()
                    .then(u => {
                        this._data.changeLoadStatus(false);
                        this.userStatusInfo = u;
                        if (u.plan) {
                            let totalUsers = this.rows.filter(u => u.active).length;
                            var tpl = `Manage.${u.plan.planName}`;
                            if (u.plan.planName != "NoPlanSelected") {
                                this.planName = u.plan.planName;
                                this.maxUsers = u.plan.maximumUser - totalUsers;
                                this.seatLeft = `${this.maxUsers} / ${u.plan.maximumUser}`;
                            } else {
                                this._translate.get(`${tpl}`).subscribe(v => {
                                    this.planName = v;
                                });
                                this.seatLeft = `${totalUsers} / ?`;
                            }

                        }

                        if (!u.isAddNew) {
                            this._translate.get('Manage.MaximumNumberError').subscribe(v => {
                                this.subscriptionMessage = v;
                            });

                        }
                    });
            });
    }

    goToBilling() {
        window.location.href = '/billing-plan';
    }

    newUser(userId) {
        if (!userId) {
            userId = "00000000-0000-0000-0000-000000000000";
            this._userService.setSharedUserId(userId);
        }
        if (this.userStatusInfo.isAddNew) {
            this._router.navigate(['user-manage', 'new']);
        }
        else {
            this.confirmDialog.visible = true;
        }

    }
    edit(row) {
        this._userService.setSharedUserId(row.userId);
        this._router.navigate(['user-manage', 'edit']);
    }

    sendInvite(row) {
        this._data.changeLoadStatus(true);
        //this._translate.get('ResetPass.SendingEmail').subscribe(value => this._alertService.success(value));
        this._userService.sendInvitation(row).then(r => {
            this._data.changeLoadStatus(false);
            this._translate.get('ResetPass.SendInSuccess').subscribe(value => this._alertService.success(value));
        });
    }

    openChangeRolePopup(row)
    {
        this.userId = row.userId;
        this.openChangeRoleDialog.visible = true;
    }

    changeRole()
    {
        this._userService.changeRole(this.userId)
        .then(result => {
            if (result.error == "")
            {
                this._translate.get(`Manage.ChangeOwnershipSuccess`).subscribe(v => {
                    this._alertService.success(v);
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                this._router.navigate(['/account']);
            }
            else
            {
                this._translate.get(`Manage.${result.error}`).subscribe(v => {
                    this._alertService.error(v);
                });
                this.openChangeRoleDialog.visible = false;
            }
        });
    }

    getUserStatus() {
        this._userService.GetUserStatus()
            .then(u => {
                this.userStatusInfo = u;
                if (u.plan) {
                    this.maxUsers = u.plan.maximumUser;
                }
                if (!u.isAddNew) {
                    this._translate.get('Manage.UnableToAddUsers').subscribe(v => {
                        console.log(v);
                        this.subscriptionMessage = v;
                    });

                }
            });
    }

    isCanAssignAsOwner(row)
    {
        if(this.currUser.roles.includes("R2") && !row.isAccountOwner)
            return true;
    }

    goToSubscription() {
        this._router.navigate(["billing-plan"]);
    }
}