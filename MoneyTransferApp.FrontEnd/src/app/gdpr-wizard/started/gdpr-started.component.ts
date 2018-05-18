import { Component, OnInit, AfterViewChecked, Renderer2, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { CompanyInfoService } from '../../shared/services/company-info.service';
import { AlertService } from '../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { CompanyTagService } from '../../shared/services/company-tag.service';
import { ModalDialog } from '../../shared/models/modal-dialog.model';

@Component({
    templateUrl: './gdpr-started.component.html',
    styleUrls: ['../gdpr.component.css']
})

export class GdprStartedComponent implements OnInit {
    // ngAfterViewInit(): void {
    //     if (this.ready) {
            
    //     }
    // }
    // ngAfterViewChecked(): void {
    //     if (this.ready) {
    //         if (this.status.isStep1Completed && this.status.isStep2Completed && this.status.isStep3Completed) {
    //             let el = this._render.selectRootElement(window);
    //             el.scrollTo(0,1000);
    //         }
    //     }
    // }

    constructor(
        private _companyInfoService: CompanyInfoService,
        private _router: Router,
        private _alert: AlertService,
        private _translate: TranslateService,
        private _data: DataService,
        private _companyTagService: CompanyTagService,
        private _render: Renderer2
    ) {
        this.confirmDialog = new ModalDialog("Confirm", 'modal-md', false)
    }

    status;
    ready;
    confirmDialog: ModalDialog;
    isGenerating = false;

    ngOnInit(): void {
        this._companyInfoService.getGdprWizardStatus()
        .then(data => {
            this.status = data;
            this.ready = true;
            if (this.ready && this.status.isStep1Completed && this.status.isStep2Completed && this.status.isStep3Completed) {
                let el = this._render.selectRootElement(window);
                setTimeout(function(){ el.scrollTo(0,1000); }, 1000);
                
            };
        });
    }

    goToStep2() {
        if (this.status.isStep1Completed) {
            if (!this.status.step2Percent && !this.status.isStep2Completed) {
                this._companyInfoService.updateWizardStatus({ step: 2, percent: 1, isCompleted: false });
            }
            this._router.navigate(['gdpr-wizard', 'data-analysis'])
        } else {
            this._translate.get('StartPage.ErrorStep2').subscribe(value => this._alert.error(value));
        }
    }

    goToStep3() {
        if (this.status.isStep1Completed && this.status.isStep2Completed) {
            if (!this.status.step3Percent && !this.status.isStep3Completed) {
                this._companyInfoService.updateWizardStatus({ step: 3, percent: 1, isCompleted: false });
            }
            this._router.navigate(['gdpr-wizard', 'data-processing'])
        } else {
            this._translate.get('StartPage.ErrorStep3').subscribe(value => this._alert.error(value));
        }
    }

    generate(force) {
        if (force) {
            this._generate();
            return;
        }

        this._companyInfoService.isGdprProgramGenerated()
        .then(generated => {
            if (generated.isGenerated) {
                this.confirmDialog.visible = true;
            } else {
                this._generate();
            }
        });
    }
    private _generate() {
        this._data.changeLoadStatus(true);
        this.isGenerating = true;
        this._companyTagService.generateProgram()
            .then(() => {
                this._data.setGdprProgramGenerated({isGenerated: true});
                this.confirmDialog.visible = false;
                this._data.changeLoadStatus(false);
                this._translate.get('StartPage.ProgramGenerated').subscribe(value => this._alert.success(value));
                this._router.navigate(['gdpr', 'dashboard'])
            });
    }
}
