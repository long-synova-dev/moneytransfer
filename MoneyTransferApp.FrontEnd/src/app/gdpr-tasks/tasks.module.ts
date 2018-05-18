import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectModule } from 'ng-select';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';

import { TaskService } from '../shared/services/task.service';
import { UserService } from '../shared/services/user.service';

import { TasksRouting } from './tasks.routing';
import { TasksComponent } from './tasks.component';
import { TasksManagementComponent } from './tasks-management/tasks-management.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AttachmentService } from '../shared/services/attachment.service';
import { PerformComponent } from './perform/perform.component';
import { PerformDetailComponent } from './perform/detail/detail.component';
import { ReviewComponent } from './review/review.component';
import { ReviewDetailComponent } from './review/detail/detail.component';
import { HistoryService } from '../shared/services/history.service';
import { CompanyTagService } from '../shared/services/company-tag.service';
import { Common } from '../shared/global/common';
import { FileUploadService } from '../shared/services/file-upload.service';
import { ModalModule } from '../shared/directives/modal.module';
import {SharedModule} from '../shared.module'

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
        TasksRouting,
        SelectModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        FileUploadModule,
        FilterPipeModule,
        MatDialogModule,
        ModalModule,
        SharedModule
    ],
    exports: [MatNativeDateModule, MatFormFieldModule, MatDatepickerModule, MatInputModule],
    declarations: [
        TasksComponent,
        TasksManagementComponent,
        PerformComponent,
        PerformDetailComponent,
        ReviewComponent,
        ReviewDetailComponent,
    ],
    entryComponents: [
        PerformDetailComponent,
        ReviewDetailComponent
    ],
    providers: [
        TaskService,
        UserService,
        AttachmentService,
        HistoryService,
        FileUploadService,
        CompanyTagService,
        Common
    ]
})

export class TasksModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-tasks.json");
}