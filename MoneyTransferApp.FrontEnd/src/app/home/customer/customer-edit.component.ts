import { OnInit, Component } from "@angular/core";
import { fadeTransition } from "../../animations/fade-transition";
import { slideInOutTransition } from "../../animations/slide-transition";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../../shared/models/customer.model";
import { CustomerService } from "../../shared/services/customer.service";
import { AlertService } from "../../shared/services/alert.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: './customer-edit.component.html',
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})
export class EditCustomerComponent implements OnInit {
    customerId;
    customerDetail = new Customer();
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _customerService: CustomerService,
        private _alertService: AlertService,
        private _translate: TranslateService,
    ) { }
    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            this.customerId = params['customerId'];
            if(this.customerId == null)
            {
                this.customerId = 0;
            }
            else
            {
                this._loadData();
            }
        });
    }

    _loadData()
    {
        this._customerService.getCustomerById(this.customerId)
            .then(response => {
                this.customerDetail = response;
            })
    }

    cancel()
    {
        this._router.navigate(['customer']);
    }

    save()
    {
        this._customerService.saveCustomer(this.customerDetail)
        .then(result => {
            console.log(result);
            if(result.Message = "success")
            this._translate.get('Customer.SavedSuccessfully').subscribe(value => this._alertService.success(value));
        })
    }
}