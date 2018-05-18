import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';

@Injectable()
export class CompanyInfoService {
    constructor(
        private _http: HttpClient
    ) { }

    public loadDataGDPRFirstStep() {
        return this._http
            .get(Globals.GET_GDPR_FIRST_STEP_DATA_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public updateDataGDPRFirstStep(GDPRFirstStepInfo) {
        return this._http
            .post(Globals.UPDATE_GDPR_FIRST_STEP_DATA_URL, GDPRFirstStepInfo)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public getGdprWizardStatus() {
        return this._http
            .get(Globals.GET_GDPR_WIZARD_STATUS_URL)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public updateWizardStatus(status) {
        return this._http
            .post(Globals.UPDATE_GDPR_WIZARD_STATUS_URL, JSON.stringify(status))
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public isGdprProgramGenerated() {
        return this._http
            .get(Globals.IS_GDPR_PROGRAM_GENERATED_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}