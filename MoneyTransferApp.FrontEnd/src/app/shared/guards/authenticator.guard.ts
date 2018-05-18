import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate, Route, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';

@Injectable()
export class AuthGuard implements CanLoad {

    previousUrl:string = undefined;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _data: DataService
    ) {}
 
    canLoad(route: Route): Observable<boolean>|boolean {
        console.log(route);
        if (this._data.checkToken()) {
            return true;
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this._router.navigate(['/account']);
        return false;

    }
}

@Injectable()
export class AuthGuardComponent implements CanActivate {

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _data: DataService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._data.checkToken()) {
            this._userService.getCurrentUser()
            .then(response => {
                this._data.updateUserInfo(response);
            });
            return true;
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this._router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}