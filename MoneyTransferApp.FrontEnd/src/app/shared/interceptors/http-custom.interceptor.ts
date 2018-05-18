import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotHavePermissionComponent } from '../../403.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AlertService } from '../services/alert.service';

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {
  private _translate: TranslateService;

  constructor(
    private _router: Router,
    private _alertService: AlertService,
    private _injector: Injector) {
    //Cannot inject through constructor due to cyclic dependency!!
      setTimeout(() => {
          this._translate = this._injector.get(TranslateService);
      });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Update last active time
    localStorage.setItem('lastActive', (new Date()).getTime().toString());

    //Add custom header
    let customRequest = request;

    let accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      customRequest = customRequest.clone({
        setHeaders: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }

    if (request.method === 'POST' || request.method === 'PUT') {
      customRequest = customRequest.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    return next
      .handle(customRequest)
      .do((ev: HttpEvent<any>) => {
      })
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          switch (response.status) {
            case 0: {
              this._translate.get('Error.NoConnection').subscribe(value => this._alertService.error(value));
              break;
            }
            case 401: {
              this._translate.get('Error.SessionExpired').subscribe(value => this._alertService.error(value));
              let timer = Observable.timer(5000)
                .subscribe(t => {
                  this._router.navigate(['account/login']);
                  timer.unsubscribe();
                });
              break;
            }
            case 403: {
              this._translate.get('Error.RestrictedArea').subscribe(value => this._alertService.error(value));
              this._router.navigate(['account/forbidden']);
              break;
            }
            case 404: {
              this._translate.get('Error.NotFoundResource').subscribe(value => this._alertService.error(value));
              this._router.navigate(['account/not-found']);
              break;
            }
            case 500: {
              this._translate.get('Error.ServerError').subscribe(value => this._alertService.error(value));
              break;
            }
            case 504: {
              this._translate.get('Error.GatewayTimeout').subscribe(value => this._alertService.error(value));
              break;
            }
            default: break;
          }
        }
        return Observable.throw(response);
      });
  }
}
