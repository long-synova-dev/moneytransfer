import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Subject } from 'rxjs';

@Injectable()
export class CustomerService {
    constructor(
        private _http: HttpClient
    ) { }

    public getAllCustomer() {
        return this._http
            .get(Globals.GET_ALL_CUSTOMER_URL)
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

    public

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}