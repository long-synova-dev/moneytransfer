import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PersonDataService {
    constructor(
        private _http: HttpClient
    ) { }

    getAllProcesses() {
        let url = Globals.GET_ALL_PROCESSES;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    getPersonGroupsByProcess(processId) {
        let url = `${Globals.GET_PERSONGROUPS_BY_PROCESS}?processTagId=${processId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    getAllPurposes(processId, personTypeId) {
        let url = `${Globals.GET_ALL_PURPOSES}?processTagId=${processId}&personTypes=${personTypeId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    savePurpose(model) {
        let url = Globals.ADD_PURPOSE;
        return this._http
            .post(url, model)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    getAllPurposesOf3rdParty(processTagId, personTypeId) {
        let url = `${Globals.GET_VENDOR_LIST}?processTagId=${processTagId}&personTypeId=${personTypeId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    getVendorCategories() {
        return this._http
            .get(Globals.GET_VENDOR_CATEGORY)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    getVendorSalesGroup() {
        return this._http
            .get(Globals.GET_VENDOR_SALES_GROUP)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    addNewVendor(model) {
        return this._http
            .post(Globals.ADD_VENDOR, model)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    deleteVendor(vendorId) {
        let url = `${Globals.DELETE_VENDOR}${vendorId}`;
        return this._http
            .post(url, {})
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    saveVendorsOnPurpose(purpose) {
        return this._http
            .post(Globals.SAVE_VENDOR_ON_PURPOSE, purpose)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    updateVendor(vendor) {
        return this._http
            .post(Globals.UPDATE_VENDOR, vendor)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
    }

    private _sharedVendorData: any;
    public setSharedVendorData(data) {
        this._sharedVendorData = data;
    }
    public getSharedVendorData() {
        return this._sharedVendorData;
    }

    private sharedVendorData = new Subject<any>();
    getShareVendorData = this.sharedVendorData.asObservable();
    changeShareVendorData(data) {
        this.sharedVendorData.next(data);
      }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}