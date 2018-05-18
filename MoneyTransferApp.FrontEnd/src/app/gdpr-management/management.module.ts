import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectModule } from 'ng-select';
import { DynamicHTMLModule, DynamicComponentModule } from 'ng-dynamic';
import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';

import { UserService } from '../shared/services/user.service';
import { CompanyInfoService } from '../shared/services/company-info.service';
import { CompanyTagService } from '../shared/services/company-tag.service';

import { ManagementRouting, ManagementRoutes } from './management.routing';

import { ManagementComponent } from './management.component';
import { PolicyComponent } from './policy/policy.component';
import { DataprocessorComponent } from './dataprocessor/dataprocessor.component';
import { PolicyManagementComponent } from './policy/policy-management.component';
import { DataprocessorManagementComponent, } from './dataprocessor/dataprocessor-management.component';
import { CounterpartComponent } from './dataprocessor/counterpart/counterpart.component';
import { ButtonModule } from './button/button.module';
import { PolicyService } from '../shared/services/policy.service';
import { DataprocessorService } from '../shared/services/dataprocessor.service';
import { AttachmentService } from '../shared/services/attachment.service';
import { FileUploadModule } from 'ng2-file-upload';
import { RiskComponent } from './risk/risk.component';
import { RiskManagementComponent } from './risk/risk-management.component';
import { ProcessesComponent } from './processes/processes.component';
import { HistoryService } from '../shared/services/history.service';
import { ModalModule } from '../shared/directives/modal.module';
import { FileUploadService } from '../shared/services/file-upload.service';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ProcessesDetailComponent } from './processes/detail/detail.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material';
import { TasksModule } from '../gdpr-tasks/tasks.module';
import { RiskService } from '../shared/services/risk.service';
import { PersondataComponent } from './persondata/persondata.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PersonDataService } from '../shared/services/persondata.service';
import { JustificationComponent } from './persondata/justification/justification.component';
import { ThirdPartyCoutryTransferComponent } from './persondata/3rd-party-country-transfer/3rd-party-country-transfer.component';
import { CopyDataProcessorDialog } from './dataprocessor/copy-dataprocessor/copy-dataprocessor-dialog.component';
import { DeleteDataProcessorDialog } from './dataprocessor/delete-dataprocessor/delete-dataprocessor-dialog.component';
import { SharedModule } from '../shared.module';
import { SendCounterpartDialog } from './dataprocessor/send-counterpart/send-counterpart.component';
import { ThirdPartyExComponent } from './persondata/3rd-party-country-transfer/ex/3rd-party-ex.component';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        FormsModule,
        ReactiveFormsModule,
        NgxDynamicTemplateModule.forRoot({routes: []}),
        ManagementRouting,
        SelectModule,
        ButtonModule,
        MatMenuModule,
        // DynamicComponentModule.forRoot({
        //     imports: [
        //         CommonModule,
        //         FormsModule,
        //         ButtonModule
        //     ]
        //   }),
        FileUploadModule,
        ModalModule,
        FilterPipeModule,
        MatDialogModule,
        TasksModule,
        MatTabsModule,
        MatExpansionModule,
        MatSidenavModule,
        SharedModule
    ],
    declarations: [
        ManagementComponent,
        PolicyComponent,
        DataprocessorComponent,
        PolicyManagementComponent,
        DataprocessorManagementComponent,
        CounterpartComponent,
        RiskComponent,
        RiskManagementComponent,
        ProcessesComponent,
        ProcessesDetailComponent,
        PersondataComponent,
        JustificationComponent,
        ThirdPartyCoutryTransferComponent,
        CopyDataProcessorDialog,
        DeleteDataProcessorDialog,
        SendCounterpartDialog,
        ThirdPartyExComponent
    ],
    entryComponents: [
        ProcessesDetailComponent,
        CopyDataProcessorDialog,
        DeleteDataProcessorDialog,
        SendCounterpartDialog
    ],
    providers: [
        UserService,
        CompanyInfoService,
        CompanyTagService,
        PolicyService,
        DataprocessorService,
        AttachmentService,
        FileUploadService,
        HistoryService,
        UserService,
        RiskService,
        PersonDataService
    ]
})

export class ManagementModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-management.json");
}