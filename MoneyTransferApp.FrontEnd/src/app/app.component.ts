import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Router, RouterLinkActive, ActivatedRoute, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DataService } from './shared/services/data.service';
import { UserService } from './shared/services/user.service';
import { CompanyInfoService } from './shared/services/company-info.service';
import { SessionManagementService } from './shared/services/session-management.service';
import { ScriptLoaderService } from './shared/services/load-script.service';
import { Intercom } from 'ng-intercom';
import { ModalDialog } from './shared/models/modal-dialog.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {

  ngAfterViewInit(): void {
    this._script.load('.application-body', './assets/js/propeller.js');
  }

  ngAfterViewChecked(): void {
    this._cdRef.detectChanges();
  }

  userInfo;
  userLogo;
  isAppLoading: boolean = false;
  preferredLang: string;
  allLanguages;
  gdprRoute;
  goLiveDate;
  userRole: string;
  userPlan;
  firstName: string;
  sessionExpiredModal: ModalDialog;

  constructor(
    private _data: DataService,
    private _userService: UserService,
    public route: Router,
    private _translate: TranslateService,
    private _sessionManagementService: SessionManagementService,
    private _cdRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _render: Renderer2,
    private _companyInfoService: CompanyInfoService,
    private _script: ScriptLoaderService,
    private _activatedRoute: ActivatedRoute,
    private _interCom: Intercom
  ) { }

  ngOnInit() {
    this._interCom.boot();

    //Show loading icon for lazy load module
    this.route.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this._data.changeLoadStatus(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        this._data.changeLoadStatus(false);
      }
    });

    this.sessionExpiredModal = new ModalDialog('Session Expired', 'modal-md', false);
    this._data.isActiveToken.subscribe(status => {
      if (status) {
        this.userLogout();
        this._translate.get('SessionExpiredModal.ModalTitle').subscribe(value => this.sessionExpiredModal = new ModalDialog(value, 'modal-md', false));
        this.sessionExpiredModal.visible = status;
      }
    });

    this._activatedRoute.queryParams.subscribe(params => {
      if (params.lang == "da") {
        localStorage.setItem("lang", '{"languageId":2,"languageCode":"da-DK"}');
        let url: string = this.route.url.substring(0, this.route.url.indexOf("?"));
        this.route.navigateByUrl(url);
      }
      else if (params.lang == "en") {
        localStorage.setItem("lang", '{"languageId":1,"languageCode":"en-UK"}');
        let url: string = this.route.url.substring(0, this.route.url.indexOf("?"));
        this.route.navigateByUrl(url);
      }
    });
    this.preferredLang = this._data.getDefaultLanguage();
    this._translate.setDefaultLang(this.preferredLang);
    this._userService.getLanguages()
      .then((response) => this.allLanguages = response);

    this._data.currentUser.subscribe(info => {
      this.userInfo = info;
      if (info != null) {
        this.userPlan = info.plan;
        this.userRole = info.roles.toString();
        this.userLogo = this._data.getLogoName(this.userInfo.fullName);
        this.firstName = this.getFirstName(info.fullName);
        localStorage.setItem("uid", this.userInfo.userId);
        localStorage.setItem("currentLangId", this.userInfo.language);
        this._translate.setDefaultLang(info.locale);

        // when login success add google Tag
        // this._script.loadGTagScript();
      }
    });

    this._data.appLoadStatus.subscribe(status => this.isAppLoading = status);

    if (this._data.checkToken()) {
      this._userService.getCurrentUser()
        .then(response => this._data.updateUserInfo(response));
      this._companyInfoService.isGdprProgramGenerated()
        .then(value => this._data.setGdprProgramGenerated(value));
    }

    this._data.isGdprProgramGenerated.subscribe(value => {
      this.gdprRoute = value.isGenerated ? 'gdpr' : 'gdpr-wizard';
      this.goLiveDate = value.goLiveDate
    });
  }

  userLogout() {
    this.isAppLoading = true;
    this._userService.userLogout()
      .then(() => this.clearStorageAndBackToLogin())
      .catch(() => this.clearStorageAndBackToLogin());
  }

  clearStorageAndBackToLogin() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.userInfo = null;
    this.isAppLoading = false;
    this.route.navigate(['/account']);
  }

  changeRoute() {
    this.route.navigateByUrl('/plan-upgrade', { skipLocationChange: true });
  }

  switchLanguage(lang) {
    this._data.changeLoadStatus(true);
    //Set storage
    localStorage.setItem("lang", JSON.stringify(lang));
    this.preferredLang = lang.languageCode;

    //Update api
    if (this._data.checkToken()) {
      this._userService.changeLanguage(lang.languageId)
        .then(data => {
          localStorage.setItem("accessToken", data.accessToken);
          this._data.changeLoadStatus(false);
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
  }

  goToBilling() {
    window.location.href = '/billing-plan';
  }

  _getLogoName(fullName) {
    let names = fullName.split(' ');
    let logo = '';
    if (names[0]) {
      logo += names[0].charAt(0);
    }
    if (names[1]) {
      logo += names[1].charAt(0);
    }
    return logo;
  }

  getFirstName(fullName) {
    let names = fullName.split(' ');
    return names[0];
  }
}
