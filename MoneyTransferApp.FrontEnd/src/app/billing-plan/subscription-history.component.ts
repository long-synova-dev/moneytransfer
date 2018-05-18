import { Component, OnInit, ViewChild } from '@angular/core';
import { BillingPlanService } from '../shared/services/billing-plan.service';
import { Page } from "../shared/models/page.model";
import { DataService } from "../shared/services/data.service";
import { fadeTransition } from '../animations/fade-transition';

@Component({
    templateUrl: './subscription-history.component.html',
    styleUrls: ['./subscription-history.component.css'],
    animations: [fadeTransition()],
    host: {'[@fadeTransition]': ''}
})

export class SubscriptionHistoryComponent implements OnInit {
    page = new Page();
    expanded: any = {};
    rows = [];
    subscription;
    plan;
    loadingIndicator;
    isLoaded:boolean = false;
    languageId;
    
    format: 'medium';

    @ViewChild('historyTable') table: any;


    constructor(
        private _billingPlanService: BillingPlanService,
        private _data: DataService,
    ) { }

    ngOnInit(): void {
        this.paginate({ offset: 0 });
    }

    paginate(event) {
        this.page.pageNumber = event.offset + 1;
        this.load();
    }

    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
    }

    load() {     
       // this._data.changeLoadStatus(true);
       //this.loadingIndicator = true;
        this._billingPlanService.getSubscriptionHistory(this.page)
            .then((response) => {
                this.subscription = response.subscription;
                this.subscription.remaining = Math.ceil((+new Date(this.subscription.trial_end) - +new Date())/(1000 * 3600 * 24));
                this.page.totalElements = response.total_elements;
                this.page.totalPages = response.total_pages;
                this.rows = response.content;
                this.plan = response.plan;
                this.isLoaded = true;
               // this.loadingIndicator = false;
               // this._data.changeLoadStatus(false);
            });
    }
}
