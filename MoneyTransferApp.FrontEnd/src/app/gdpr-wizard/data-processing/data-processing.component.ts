import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { fadeTransition } from '../../animations/fade-transition';

import { CompanyTagService } from '../../shared/services/company-tag.service';
import { Globals } from '../../shared/global/global';
import { Tag } from '../../shared/models/tag.model';
import { TreePath } from '../../shared/models/tree-path.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../shared/services/alert.service';
import { tableColumnHighlightTransition } from '../../animations/table-column-highlight-transition';
import { Observable } from 'rxjs/Rx';
import { CompanyInfoService } from '../../shared/services/company-info.service';

@Component({
    templateUrl: './data-processing.component.html',
    styleUrls: ['../gdpr.component.css'],
    animations: [fadeTransition(), tableColumnHighlightTransition()],
    host: { '[@fadeTransition]': '' }
})

export class DataProcessingComponent implements OnInit {
    listItSystem: Array<Tag>;
    constructor(
        private _companyTagService: CompanyTagService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _companyInfoService: CompanyInfoService
    ) { }


    ngOnInit() {
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_IT_SYSTEM, true)
            .then(response => {
                this.listItSystem = response;
                this._checkMarked();
            });

        this._unselectIfUserClickBackInInner();
    }

    click(item) {
        item.marked = true;
        this._companyTagService.setSharedTuple(new Array(item));
        this._router.navigate(['ex'], { relativeTo: this._activatedRoute });
    };

    save(isCont) {
        if (isCont) {
            if (!this._validate()) {
                return;
            }
        }
        this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value));

        if (isCont) {
            this._companyInfoService.updateWizardStatus({ step: 3, percent: 100, isCompleted: true })
                .then(() => {
                    this._router.navigate(['gdpr-wizard']);
                });
        } else {
            this._router.navigate(['gdpr-wizard', 'getstarted']);
        }
    }

    private _validate() {
        let result = true;
        this.listItSystem.forEach(it => {
            if (!it.marked) {
                it.validateState = "invalid";
                result = false;
            }
        });

        if (!result) {
            this._translate.get('DataProcessing.ValidationError').subscribe(value => this._alert.error(value));
        }

        let timer = Observable.timer(2000).subscribe(() => {
            this.listItSystem.forEach(it => it.validateState = "valid");
            timer.unsubscribe();
        })
        return result;
    }

    private _unselectIfUserClickBackInInner() {
        this._companyTagService.isSaved.subscribe(saved => {
            if (!saved) {
                this.ngOnInit();
            }
        });
    };

    private _checkMarked() {
        this._companyTagService.traverseTree(new TreePath([''], Globals.CATEGORY_IT_SYSTEM_TYPE))
            .then(response => {
                response.forEach(element => {
                    let activeItSystem = this.listItSystem.find(item => item.tagId === element[0].tagId);
                    activeItSystem.marked = true;
                });
            });
    }
}
