import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers } from '@angular/http';
import * as moment from 'moment';
import { Globals } from '../global/global';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Injectable()
export class SessionManagementService {
    private _checkInterval: number = 1 * 5 * 1000;

    constructor(
        private _http: Http,
        private _alertService: AlertService,
        private _router: Router,
        private _dataService: DataService) {

        Observable.interval(this._checkInterval)
            .subscribe(() => {
                console.log(`Begin checking token--------------`);

                let lastActiveStorage = localStorage.getItem('lastActive');
                let issueAtStorage = localStorage.getItem('issueAt');
                let tokenExpireAtStorage = localStorage.getItem('expireAt');
                let sessionTimeStorage = localStorage.getItem('sessionTime');
                let accessToken = localStorage.getItem('accessToken');
                let refreshToken = localStorage.getItem('refreshToken');

                if (!accessToken && this._router.url.indexOf('/account') !== 0 && this._router.url.indexOf('/public') !== 0) {
                    console.log('Session expired. Logging user out.');
                    this._logUserOut();
                    // this._dataService.updateUserInfo(null);
                }
                else if (accessToken && refreshToken && lastActiveStorage && tokenExpireAtStorage && sessionTimeStorage && issueAtStorage) {

                    let now = moment();
                    let lastActive = moment(lastActiveStorage, "x");
                    let tokenIssuedAt = moment(issueAtStorage);
                    let tokenExpireTime = parseInt(tokenExpireAtStorage) * 60 * 1000;
                    let sessionTime = parseInt(sessionTimeStorage) * 60 * 1000;

                    let totalInactiveTime = moment.duration(now.diff(lastActive)).asMilliseconds();
                    let tokenIssuedAgo = moment.duration(now.diff(tokenIssuedAt)).asMilliseconds();

                    console.log(`Last Active = ${lastActive.toString()}; Now = ${now.toString()}; Token Issued At = ${tokenIssuedAt.toString()}; Token Issued = ${tokenIssuedAgo} miliseconds ago; Total User Inactive Time = ${totalInactiveTime} miliseconds`);

                    if (totalInactiveTime >= sessionTime) {
                        console.log('Session expired. Logging user out.');
                        // this._logUserOut();
                        this._dataService.updateActiveToken(true);
                    } else if (tokenIssuedAgo >= tokenExpireTime - this._checkInterval) {
                        console.log('Token is going to expire. Trying to refresh the token.');
                        this._refreshToken(accessToken, refreshToken)
                    } else {
                        console.log('Nothing to do now yet.');
                    }
                }
            })
    }

    private _logUserOut() {
        this._alertService.warn("Your session has expired. You will be automatically redirected to the login screen shortly.");

        this._dataService.updateUserInfo(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        Observable.timer(1000)
            .subscribe(() => {
                this._router.navigate(['account/login'])
            });
    }

    private _refreshToken(accessToken, refreshToken) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);

        this._http.post(Globals.REFRESH_TOKEN_DATA_URL, { refreshToken: refreshToken }, { headers: headers })
            .toPromise()
            .then((response) => {
                var data = response.json();
                if (data.errors) {
                    console.log('Error when refreshing token.');
                } else {
                    for (let item in data) {
                        localStorage.setItem(item, data[item]);
                    }
                    console.log('Token refreshed successfully.');
                }
            })
    }
}