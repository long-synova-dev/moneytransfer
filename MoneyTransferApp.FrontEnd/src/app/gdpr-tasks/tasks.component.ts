import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';
@Component({
    template: `
        <router-outlet></router-outlet>
    `
})

export class TasksComponent implements OnInit {
    ngOnInit(): void {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
    }
    constructor(
        private _translate: TranslateService,
        private _data: DataService
    ) {
        this._translate.get("Management.Completeness").subscribe(value => console.log(value));
    }
}