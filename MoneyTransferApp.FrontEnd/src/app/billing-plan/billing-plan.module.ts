import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { BillingPlanRouting } from './billing-plan.routing';

import { BillingPlanComponent } from '../billing-plan/billing-plan.component';
import { SubscriptionComponent } from '../billing-plan/subscription.component';
import { SubscriptionHistoryComponent } from '../billing-plan/subscription-history.component';
import { BillingPlanService } from '../shared/services/billing-plan.service';
import { ModalModule } from '../shared/directives/modal.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { CancelSubscriptionComponent } from './cancel-subscription.component';
import { UnableDowngradeSubscriptionComponent } from './unable-downgrade-subscription.component';
import { ReplacePipe } from '../shared/pipes/replace.pipes';
import { SharedModule } from '../shared.module';

@NgModule({
    imports: [
        CommonModule,
        ModalModule,
        FormsModule,
        ReactiveFormsModule,
        BillingPlanRouting,
        NgxDatatableModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            isolate: true
        }),
        FilterPipeModule,
        MatDialogModule,
        SharedModule
    ],
    entryComponents: [
        CancelSubscriptionComponent,
        UnableDowngradeSubscriptionComponent
    ],
    declarations: [
        BillingPlanComponent,
        SubscriptionComponent,
        SubscriptionHistoryComponent,
        CancelSubscriptionComponent,
        UnableDowngradeSubscriptionComponent,
        ReplacePipe
    ],
    providers: [
        BillingPlanService
    ]
})

export class BillingPlanModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-billing-plan.json");
}