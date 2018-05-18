import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from '../shared/directives/modal.module';

import { GdprWizardRouting } from './gdpr-wizard.routing';
import { GdprWizardComponent } from './gdpr-wizard.component';

import { CompanyInfoService } from '../shared/services/company-info.service';
import { CompanyTagService } from '../shared/services/company-tag.service';
import { AuthGuard, AuthGuardComponent } from '../shared/guards/authenticator.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { PlanGuard } from '../shared/guards/plan.guard';
import { TextMaskModule } from 'angular2-text-mask';

import { GdprStartedComponent } from './started/gdpr-started.component';
import { GdprFirstStepComponent } from './first-step/gdpr-first-step.component';
import { GdprDataAnalysisComponent } from './data-analysis/data-analysis.component';
import { GdprDataAnalysisStep1Component } from './data-analysis/step-1/gdpr-data-analysis-step-1.component';
import { GdprDataAnalysisStep2Component } from './data-analysis/step-2/gdpr-data-analysis-step-2.component';
import { GdprDataAnalysisStep2ExComponent } from './data-analysis/step-2/ex-step/gdpr-data-analysis-step-2-ex.component';
import { GdprDataAnalysisStep3Component } from './data-analysis/step-3/gdpr-data-analysis-step-3.component';
import { GdprDataAnalysisStep3BComponent } from './data-analysis/step-3/step-b/gdpr-data-analysis-step-3b.component';
import { GdprDataAnalysisStep3BAComponent } from './data-analysis/step-3/step-ba/gdpr-data-analysis-step-3ba.component';
import { GdprDataAnalysisStep3BBComponent } from './data-analysis/step-3/step-bb/gdpr-data-analysis-step-3bb.component';
import { DataProcessingComponent } from './data-processing/data-processing.component';
import { DataProcessingExComponent } from './data-processing/ex/data-processing-ex.component';
import { NumericDirective } from '../shared/directives/numberic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StepCancelComponent } from './confirm-dialog/confirm-dialog.component';
import { StepCancelComponent2 } from './confirm-dialog/confirm-dialog-2.component';

@NgModule({
    imports: [
        CommonModule,
        GdprWizardRouting,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            isolate: true
        }),
        SelectModule,
        ModalModule,
        TextMaskModule,
        MatDialogModule
    ],
    declarations: [
        GdprWizardComponent,
        GdprFirstStepComponent,
        GdprStartedComponent,
        GdprDataAnalysisComponent,
        GdprDataAnalysisStep1Component,
        GdprDataAnalysisStep2Component,
        GdprDataAnalysisStep2ExComponent,
        GdprDataAnalysisStep3Component,
        GdprDataAnalysisStep3BComponent,
        GdprDataAnalysisStep3BAComponent,
        GdprDataAnalysisStep3BBComponent,
        DataProcessingComponent,
        DataProcessingExComponent,
        NumericDirective,
        StepCancelComponent,
        StepCancelComponent2
    ],
    entryComponents: [StepCancelComponent,StepCancelComponent2],
    providers: [
        CompanyInfoService,
        CompanyTagService,
        AuthGuard, 
        AuthGuardComponent,
        RoleGuard,
        PlanGuard
    ]
})

export class GdprWizardModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-gdpr.json");
}