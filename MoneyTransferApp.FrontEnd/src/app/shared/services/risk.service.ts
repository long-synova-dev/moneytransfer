import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';

@Injectable()
export class RiskService {
    constructor(
        private _http: HttpClient
    ) { }

    public getAllRisks() {
        return this._http
            .get(Globals.GET_ALL_RISK_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getRiskDetail(riskId) {
        let url = `${Globals.GET_RISK_BY_ID_URL}/${riskId}`;
        return this._http
            .post(url, [])
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    public updateRisk(risk) {
        return this._http
            .post(Globals.UPDATE_RISK_URL, risk)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    public addNewRisk(risk) {
        return this._http
            .post(Globals.ADD_NEW_RISK_URL, risk)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    public getAllRisksType() {
        return this._http
            .get(Globals.GET_RISKTYPE_OPTIONS_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    public getAllRisksOrganization() {
        return this._http
            .get(Globals.GET_ORGANIZATION_OPTIONS_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}