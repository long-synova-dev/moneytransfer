import { Injectable } from '@angular/core';
import { Router, CanActivate, Route, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import * as _ from 'underscore';
import { AlertService } from '../services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class RoleGuard implements CanActivate {

    previousUrl: any;

    constructor(
        private _router: Router,
        private _alertService: AlertService,
        private _translate: TranslateService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let roles = route.data["roles"] as Array<string>;
        let userRoles = !localStorage.getItem('roles') ? null : localStorage.getItem('roles').split(',');
        let checkRoles = _.intersection(roles, userRoles).length !=0 ? true : false;

        if (checkRoles) {
            return true;
        }
        
        this._translate.get('Error.RestrictedArea').subscribe(value => this._alertService.error(value, null, true, true));
        return false;
    }
}
