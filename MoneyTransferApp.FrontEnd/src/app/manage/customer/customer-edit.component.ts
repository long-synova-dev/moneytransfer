import { OnInit, Component } from "@angular/core";
import { fadeTransition } from "../../animations/fade-transition";
import { slideInOutTransition } from "../../animations/slide-transition";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../../shared/models/customer.model";
import { CustomerService } from "../../shared/services/customer.service";
import { AlertService } from "../../shared/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { Receiver } from "../../shared/models/receiver.model";
import { ModalDialog } from "../../shared/models/modal-dialog.model";

@Component({
    templateUrl: './customer-edit.component.html',
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})
export class EditCustomerComponent implements OnInit {
    customerId;
    customerDetail = new Customer();
    receiverList;
    receiver = new Receiver();
    addReceiverDiablog: ModalDialog;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _customerService: CustomerService,
        private _alertService: AlertService,
        private _translate: TranslateService,
    ) { 
        this._translate.get('Receiver.Info').subscribe(value => this.addReceiverDiablog = new ModalDialog(value, "modal-md", true));
    }
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
        this._customerService.getListReceiver(this.customerId)
            .then(response => {
                this.receiverList = response;
            })
        this._customerService.getCustomerById(this.customerId)
            .then(response => {
                this.customerDetail = response;
            })
    }

    cancel()
    {
        this._router.navigate(['home', 'customer']);
    }

    save()
    {
        this._customerService.saveCustomer(this.customerDetail)
        .then(result => {
            console.log(result);
            if(result.Message = "success")
            {
                this._translate.get('Customer.SavedSuccessfully').subscribe(value => this._alertService.success(value));
                this.customerId = result.customerId;
                if(result.receiverId > 0)
                {
                    this._router.navigate(['home', 'customer']);
                }
                
            }
            else{
                this._translate.get('Customer.SaveError').subscribe(value => this._alertService.error(value));
                if(result.customerId == -1) {
                    this.customerId = 0;
                }
            }
        })
    }

    openAddReceiverDialog()
    {
        this._customerService.getCustomerById
        this.addReceiverDiablog.visible = true;
    }

    receiverSave()
    {
        this.receiver.customerId = this.customerId;
        this._customerService.saveReceiver(this.receiver)
        .then(result => {
            console.log(result);
            if(result.Message = "success")
            {
                this._translate.get('Receiver.SavedSuccessfully').subscribe(value => this._alertService.success(value));
                this.addReceiverDiablog.visible = false;
                this._loadData();
            }
            else{
                this._translate.get('Receiver.SaveError').subscribe(value => this._alertService.error(value));
            }
        })
    }

    receiverCancel()
    {
        this.addReceiverDiablog.visible = false;
    }
}