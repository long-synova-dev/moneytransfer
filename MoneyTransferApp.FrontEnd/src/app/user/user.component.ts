import { Component, OnInit, OnDestroy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';
import { Intercom } from 'ng-intercom';
import { Meta } from '@angular/platform-browser';
import { ScriptLoaderService } from '../shared/services/load-script.service';

@Component({
    selector: 'user-page',
    template: `
        <router-outlet></router-outlet>
    `
})

export class UserComponent implements OnInit, OnDestroy {

    constructor(
        private _data: DataService,
        private _translate: TranslateService,
        private _meta: Meta,
        private _loadScript: ScriptLoaderService
    ) { }

    ngOnInit(): void {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);

        this.addClassStyle();
    }

    ngOnDestroy(): void {
        this.removeClassStyle();
    }

    addClassStyle() {
        let body = document.getElementsByTagName('body');
        let metaContent = "width=device-width, initial-scale=1";
        
        this._meta.updateTag({name: "viewport", content: metaContent});
        body[0].classList.add('userModule');
    }
    removeClassStyle() {
        let body = document.getElementsByTagName('body');
        let metaContent = "initial-scale=1, maximum-scale=1";

        this._meta.updateTag({name: "viewport", content: metaContent});
        body[0].classList.remove('userModule');
    }
}