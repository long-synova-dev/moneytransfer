import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../../shared/services/alert.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: './transaction.component.html'
})

export class TransactionComponent implements OnInit{

    customerId: any;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _alertService: AlertService,
        private _translate: TranslateService){}

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            this.customerId = params['customerId'];
            if(this.customerId == null)
            {
                this._translate.get('Transaction.CustomerNotExist').subscribe(value => this._alertService.error(value));
                this._router.navigate(['home', 'customer']);
            }
            else
            {
                this._loadData();
            }
        });
    }

    _loadData()
    {
        
    }
}