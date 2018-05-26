import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Subject } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable()
export class CustomerService {
    constructor(
        private _http: HttpClient
    ) { }

    public getAllCustomer(page) : any {
        return this._http
            .get(`${Globals.GET_ALL_CUSTOMER_URL}?keyword=${page.keyword}&PageNumber=${page.pageNumber}&ItemsPerPage=${page.itemsPerPage}&OrderBy=${page.orderBy}&IsDesc=${page.isDesc}`)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public getCustomerById(id)
    {
        return this._http
            .get(Globals.GET_CUSTOMER_BY_ID_URL, )
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public saveCustomer(customer: Customer)
    {
        return this._http
        .post(Globals.SAVE_CUSTOMER_URL, customer)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}