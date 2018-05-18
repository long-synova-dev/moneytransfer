import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Globals } from '../global/global';

@Injectable()
export class DataprocessorService {
    
    constructor(
        private _http: HttpClient
    ) { }
    
    private counterpartStatus = new Subject<boolean>();
    getCounterpartStatus = this.counterpartStatus.asObservable();
    updateCounterpartStatus(status) {
        this.counterpartStatus.next(status);
    }

    public getDataprocessorById(dataprocessorId: any) {
        let url = `${Globals.GET_ALL_DATA_PROCESSOR_BY_ID_URL}/${dataprocessorId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getAllDataprocessor() {
        return this._http
            .get(Globals.GET_ALL_DATA_PROCESSOR_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public copyDataprocessor(model) {
        return this._http
            .post(Globals.COPY_DATA_PROCESSOR_URL, model)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public deleteDataprocessor(processorId) {
        return this._http
            .delete(`${Globals.DELETE_DATA_PROCESSOR_URL}/${processorId}`)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public updateDataprocessor(dataprocessor) {
        return this._http
            .post(Globals.UPDATE_DATA_PROCESSOR_URL, JSON.stringify(dataprocessor))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }
    
    public updateCounterpart(dataprocessor) {
        return this._http
            .post(Globals.UPDATE_COUNTERPART_URL, JSON.stringify(dataprocessor))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public getCounterpart(dataprocessorId: any) {
        let url = `${Globals.GET_COUNTERPART_URL}/${dataprocessorId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public senDataprocessor(dataprocessorId) {
        let url = `${Globals.SEND_DATA_PROCESSOR_URL}/${dataprocessorId}`;
        return this._http
            .post(url, {})
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    private _sharedDataId: any;
    public setSharedDataId(id) {
        this._sharedDataId = id;
    }
    public getSharedDataId() {
        return this._sharedDataId;
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}