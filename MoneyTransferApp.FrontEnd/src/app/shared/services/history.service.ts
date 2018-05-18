import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Globals } from '../global/global';

@Injectable()
export class HistoryService {
    //private historyContent = new Subject<any>();

    constructor(
        private _http: HttpClient
    ) { }

    //inputPolicy = this.historyContent.asObservable();
    //model: {type: DocumentType, referId}
    public getHistory(model) {
        return this._http
            .post(Globals.GET_HISTORY_OF_TYPE, JSON.stringify(model))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}