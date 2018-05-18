import { DOCUMENT } from '@angular/platform-browser'
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeTransition } from '../animations/fade-transition';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { MatMenuTrigger } from '@angular/material';
import { CompanyInfoService } from '../shared/services/company-info.service';
import { ScriptLoaderService } from '../shared/services/load-script.service';

@Component({
    templateUrl: './gdpr.component.html',
    styleUrls: ['./gdpr.component.css'],
    animations: [fadeTransition()],
    host: { '[@fadeTransition]': '' }
})

export class GdprComponent implements OnInit {

    showPrivateNavigate;
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    constructor(
        private _data: DataService,
        private _translate: TranslateService,
        private _companyInforService: CompanyInfoService,
        private _router: Router,
        private _script: ScriptLoaderService,
        @Inject(DOCUMENT) private _document: Document
    ) { }

    ngOnInit(): void {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);

        this._companyInforService.isGdprProgramGenerated()
            .then(generated => {
                if (!generated.isGenerated) {
                    this._router.navigate(['gdpr-wizard']);
                }
            });
        
        let curentUserRole = localStorage.getItem('roles').split(',');
        this.checkNavigate(curentUserRole);
    }

    checkNavigate(roles:Array<any>) {
        let MasterRole = ['R2', 'R3'];
        let isMasterUser = roles.forEach(element => {
            let isTrue = MasterRole.find(x => x == element);
            if (isTrue) {
                this.showPrivateNavigate = true;
            }
        });
    }

    smallMenuClick(trigger) {
        this.triggers.forEach(x => x.closeMenu());
        trigger.openMenu();
        this._document.body.classList.add('menu-open');
    }

    closeMenu() {
        this._document.body.classList.remove('menu-open');
    }
}