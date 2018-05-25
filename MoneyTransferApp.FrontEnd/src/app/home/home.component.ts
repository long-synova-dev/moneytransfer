import { Component, OnInit } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { fadeTransition } from '../animations/fade-transition';
import { UserService } from '../shared/services/user.service';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../shared/global/global';
import { CustomerService } from '../shared/services/customer.service';
import { Page } from '../shared/models/page.model';

@Component({
    selector: 'home-page',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeTransition()],
    host: {'[@fadeTransition]': ''}
})

export class HomeComponent implements OnInit {
    page = new Page();
    rows: any = [];
    selected = [];

    constructor(
        private _userService: UserService,
        private _dataService: DataService,
        private _translate: TranslateService,
        private _customerService: CustomerService
    ) { }

    ngOnInit() {
        let preferredLang = this._dataService.getDefaultLanguage();
        console.log(preferredLang);
        this._translate.setDefaultLang(preferredLang);
        // Load all customer
        
    }

    paginate(event) {
        this.page.pageNumber = event.offset + 1;
        this._getAllCustomer();
    }

    sort(event) {
        this.page.orderBy = event.column.prop;
        this.page.isDesc = event.newValue === 'desc';
        this.rows = [];
        this._getAllCustomer();
    }

    filter(event) {
        if (event.key === "Enter" || event.key === "Backspace" || event.key === "Delete") {
            this.page.pageNumber = 1;
            this._getAllCustomer();
        }
    }

    _getAllCustomer() {
        this._customerService.getAllCustomer(this.page)
            .then(response => {
                this.page.totalElements = response.totalItems;
                this.page.totalPages = response.numberOfPages;
                this.rows = response.data;

                this._dataService.changeLoadStatus(false);
            })    
    }
    
}