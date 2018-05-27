import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Subject } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable()
export class TransactionService {
    constructor(
        private _http: HttpClient
    ) { }

    public fillTransactionInfo(customerId) : any {
        return this._http
            .post(Globals.GET_TRANSACTION_INFO_URL, customerId)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}