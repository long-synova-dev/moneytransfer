import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { Globals } from '../global/global';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {
    private _isPopupClosed = new Subject<boolean>();
    public isClosed = this._isPopupClosed.asObservable();
    
    constructor(
        private _http: HttpClient
    ) { }

    public isPopupClosed(saved: boolean) {
        this._isPopupClosed.next(saved);
    }

}