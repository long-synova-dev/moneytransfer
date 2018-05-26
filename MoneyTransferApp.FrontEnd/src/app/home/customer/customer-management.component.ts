import { OnInit, Component } from "@angular/core";
import { Page } from "../../shared/models/page.model";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "../../shared/services/data.service";
import { TranslateService } from "@ngx-translate/core";
import { CustomerService } from "../../shared/services/customer.service";
import { CommonService } from "../../shared/services/common.service";

@Component({
    templateUrl: './customer-management.component.html'
})

export class CustomerManagement implements OnInit{
    page = new Page();
    rows: any = [];
    selected = [];

    constructor(
        private _router: Router,
        private _activeRoute: ActivatedRoute,
        private _dataService: DataService,
        private _customerService: CustomerService,
        private _commonService: CommonService
    ) { }

    ngOnInit() {
        // Load all customer
        this.paginate({ offset: 0 });
        this._waitForPopupClosed();
    }

    _waitForPopupClosed() {
        console.log("reload onInit");
        this._commonService.isClosed.subscribe(closed => {
            if (closed) {
                this.ngOnInit();
                this._commonService.isPopupClosed(false);
            }
        });
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

    newCustomer()
    {
        this._router.navigate(['new'], {relativeTo: this._activeRoute});
    }
}