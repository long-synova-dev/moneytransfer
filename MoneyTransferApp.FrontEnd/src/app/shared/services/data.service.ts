import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { IOption } from 'ng-select';

import * as moment from 'moment';

@Injectable()
export class DataService {

  private userInfo = new Subject<any>();
  private gdprProgramGenerated = new Subject<any>();
  private appLoading = new Subject<boolean>();
  private IOptions = new Subject<Array<IOption>>();
  private activeToken = new Subject<boolean>();

  currentUser = this.userInfo.asObservable();
  appLoadStatus = this.appLoading.asObservable();
  getIOptions = this.IOptions.asObservable();
  isGdprProgramGenerated = this.gdprProgramGenerated.asObservable();
  isActiveToken = this.activeToken.asObservable();

  constructor(private _translate: TranslateService) { }

  updateUserInfo(info) {
    this.userInfo.next(info);
  }

  changeLoadStatus(status: boolean) {
    this.appLoading.next(status);
  }

  changeIOpitons(options) {
    this.IOptions.next(options)
  }

  setGdprProgramGenerated(value) {
    this.gdprProgramGenerated.next(value);
  }
  
  updateActiveToken(status) {
    this.activeToken.next(status);
  }

  checkToken() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      let now = moment();
      let issueAt = moment(localStorage.getItem('issueAt'));
      let expireAt = parseInt(localStorage.getItem('expireAt'));
      let duration = moment.duration(now.diff(issueAt));
      if (duration.asMinutes() < expireAt) {
        return true;
      }
      return false;
    }
    return false;
  }

  getDefaultLanguage() {
    let preferredLang = 'vi-VN';
    let lang = localStorage.getItem("lang");
    if (!lang) {
      localStorage.setItem("lang", '{"languageId":1,"languageCode":"vi-VN"}');
    } else {
      preferredLang = JSON.parse(lang).languageCode;
    }
    return preferredLang;
  }

   shareContentEditor: Array<any> = [];

  public updateshareContentEditor(key: string, value: string) {
    let item = {key: key, value: value};
    console.log(item);
    if (this.shareContentEditor.length == 0) {
      this.shareContentEditor.push(item);
    } else {
      let hasValue = this.shareContentEditor.find(item => item.key == key);
      if (hasValue) {
        hasValue.value = value;
      } else {
        this.shareContentEditor.push(item);
      }
    }
    console.log('update', this.shareContentEditor);
  }

  public getShareContentEditor() {
    console.log('get', this.shareContentEditor);
    return this.shareContentEditor;
  }

  getLogoName(fullName) {
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

}