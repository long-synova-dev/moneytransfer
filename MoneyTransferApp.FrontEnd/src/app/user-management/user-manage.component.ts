import { Component, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
import { UserService } from '../shared/services/user.service';
import { MatchPasswordValidation } from '../shared/services/match-password.service';
import { Globals } from '../shared/global/global';
import { DataService } from '../shared/services/data.service';
import { AlertService } from '../shared/services/alert.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { ModalDialog } from '../shared/models/modal-dialog.model';
import { Page } from '../shared/models/page.model';

@Component({
    templateUrl: './user-manage.component.html',
    styleUrls: ['./user-manage.component.css']
})


export class UserManageComponent implements OnInit {
    maxUsers;
    page = new Page();
    rows: any = [];
    selected = [];
    
    userStatusInfo: any;
    subscriptionMessage: string;

    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('activeTmpl') activeTmpl: TemplateRef<any>;
    @ViewChild('createOnTmpl') createOnTmpl: TemplateRef<any>;
    deleteConfirm: ModalDialog;
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
    }

    ngOnInit() {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
        //  this.getUserStatus();
        this.paginate({ offset: 0 });
        this._waitForPopupClosed();
    }

    paginate(event) {
        this.page.pageNumber = event.offset + 1;
        this._loadData();
    }

    sort(event) {
        this.page.orderBy = event.column.prop;
        this.page.isDesc = event.newValue === 'desc';
        this.rows = [];
        this._loadData();
    }

    filter(event) {
        if (event.key === "Enter" || event.key === "Backspace" || event.key === "Delete") {
            this.page.pageNumber = 1;
            this._loadData();
        }
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
        this._userService.getAllUser(this.page)
            .then(data => {
                this.rows = data;
            });
    }

    newUser() {
        this._router.navigate(['user-manage', 'new']);
    }

    edit(row) {
        this._userService.setSharedUserId(row.userId);
        this._router.navigate(['user-manage', 'edit']);
    }
}