import { Component, OnInit } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { fadeTransition } from '../animations/fade-transition';
import { UserService } from '../shared/services/user.service';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../shared/global/global';
import { CustomerService } from '../shared/services/customer.service';
import { Page } from '../shared/models/page.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'management',
    template: `
        <router-outlet></router-outlet>
    `,
    styleUrls: ['./manage.component.css']
})

export class ManageComponent implements OnInit {
    showPrivateNavigate;

    constructor(
        private _data: DataService,
        private _translate: TranslateService,
        private _router: Router
    ){ }

    ngOnInit(){
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);

        let curentUserRole = localStorage.getItem('roles').split(',');
        this.checkNavigate(curentUserRole);
    }

    checkNavigate(roles:Array<any>) {
        let allowedRole = ['R0', 'R1', 'R2'];
        let isMasterUser = roles.forEach(element => {
            let isTrue = allowedRole.find(x => x == element);
            if (isTrue) {
                this.showPrivateNavigate = true;
            }
            else
            {
                this._router.navigate(['account', 'login']);
            }
        });
    }
}