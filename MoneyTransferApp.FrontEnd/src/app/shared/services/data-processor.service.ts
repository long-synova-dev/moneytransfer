import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';

@Injectable()
export class DataProcessorService {
    constructor(
        private _http: HttpClient
    ) { }

    public getAllDataProcessors() {
        return this._http
            .get(Globals.GET_ALL_DATA_PROCESSOR_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}