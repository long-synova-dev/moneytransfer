import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';

@Injectable()
export class BillingPlanService {
    constructor(
        private _http: HttpClient
    ) { }

    public getBillingPlan() {
        return this._http
            .get(Globals.GET_BILLING_PLANS_URL)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public getCurrentStatus() {
        return this._http
            .get(Globals.GET_CURRENT_BILLING_PLANS_URL)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public getAddonsPlan() {
        return this._http
            .get(Globals.GET_ADDONS_PLANS_URL)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public checkPaymentMethod() {
        return this._http
            .get(Globals.CHECK_PAYMENT_METHOD_URL)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public changeSubscription(subscription) {
        return this._http
            .post(Globals.CHANGE_SUBSCRIPTION_URL, JSON.stringify(subscription))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    public cancelSubscription() {
        return this._http
                .post(Globals.CANCEL_SUBCRIPTION_URL, '')
                .toPromise()
                .then(response => response)
                .catch(this.handleError);
    }

    public getCouponInfo(coupon, plan) {
        return this._http
                .get(`${Globals.GET_COUPON_INFO_URL}/${coupon}?plan=${plan}`)
                .toPromise()
                .then(response => response)
                .catch(this.handleError);
    }

    public getSubscriptionHistory(page) {
        return this._http
            .get(`${Globals.GET_SUBSCRIPTION_HISTORY_URL}?page=${page.pageNumber}&size=${page.itemsPerPage}`)
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}