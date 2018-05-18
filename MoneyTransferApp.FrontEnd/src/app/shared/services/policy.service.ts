import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Globals } from '../global/global';

@Injectable()
export class PolicyService {
    private policyContent = new Subject<any>();

    constructor(
        private _http: HttpClient
    ) { }

    inputPolicy = this.policyContent.asObservable();

    updatePolicyContent(key: string, value: string) {
        let item = {key: key, value: value};
        this.policyContent.next(item);
    }

    public getPolicyById(policyId: any) {
        let url = `${Globals.GET_POLICY_BY_ID_URL}/${policyId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getAllPolicy() {
        return this._http
            .get(Globals.GET_ALL_POLICY_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public updatePolicy(policy) {
        return this._http
            .post(Globals.UPDATE_POLICY_URL, JSON.stringify(policy))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }
    public downloadPDF(id) {
        let url = `${Globals.DOWNLOAD_PDF_FILE}/${id}`;
        return this._http
            .post(url,{})
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public 
    
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}