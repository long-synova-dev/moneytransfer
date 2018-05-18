import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import * as _ from 'underscore';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../gdpr.component.css']
})

export class DashboardComponent implements OnInit {
    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _userSevice: UserService,
        private _router: Router
    ) { }

    overViewData;

    ngOnInit() {
        this._userSevice.getOverView()
            .then(response => {
                this.overViewData = response;
                let userRoles = !localStorage.getItem('roles') ? null : localStorage.getItem('roles').split(',');
                this.overViewData.forEach(element => {
                    let itemRoles = element.roles.split(',');
                    let isCheck = _.intersection(userRoles, itemRoles).length !=0 ? true : false;
                    isCheck ? element.show = true : element.show = false;
                });
            })
    }

}