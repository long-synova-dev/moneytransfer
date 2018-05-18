import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatMenuModule } from '@angular/material';
import { GdprRouting } from './gdpr.routing';
import { GdprComponent } from './gdpr.component';

import { CompanyInfoService } from '../shared/services/company-info.service';
import { CompanyTagService } from '../shared/services/company-tag.service';
import { TaskService } from '../shared/services/task.service';
import { RiskService } from '../shared/services/risk.service';
import { PolicyService } from '../shared/services/policy.service';
import { DataProcessorService } from '../shared/services/data-processor.service';
import { AuthGuard, AuthGuardComponent } from '../shared/guards/authenticator.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { PlanGuard } from '../shared/guards/plan.guard';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        GdprRouting,
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
        MatMenuModule,
        FilterPipeModule
    ],
    declarations: [
        GdprComponent,
        DashboardComponent,
    ],
    providers: [
        AuthGuard,
        AuthGuardComponent,
        RoleGuard,
        PlanGuard,
        TaskService,
        RiskService,
        PolicyService,
        DataProcessorService,
    ]
})

export class GdprModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-gdpr.json");
}