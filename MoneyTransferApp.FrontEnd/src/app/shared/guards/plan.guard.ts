import { Injectable } from '@angular/core';
import { Router, CanActivate, Route, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';
import { AlertService } from '../services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PlanGuard implements CanActivate {

    previousUrl: any;

    constructor(
        private _router: Router,
        private _alertService: AlertService,
        private _translate: TranslateService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let plans = route.data["plans"] as Array<string>;
        let userPlan = !localStorage.getItem('plan') ? null : localStorage.getItem('plan').split(',');
        let checkPlan = _.intersection(plans, userPlan).length != 0 ? true : false;

        if (checkPlan) {
            return true;
        }

        this._translate.get('Error.UpgradeNow').subscribe(value => this._alertService.error(value, null, true, true));
        let timer = Observable.timer(1500).subscribe(() => {
            if (this._router.url.indexOf('/billing-plan') == -1) {
                timer.unsubscribe();                
                window.location.href = '/billing-plan';
                return;
            }
        });

        return false;
    }
}
