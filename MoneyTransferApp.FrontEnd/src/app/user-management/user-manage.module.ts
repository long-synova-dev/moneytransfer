import {CommonModule} from '@angular/common'
import { NgModule } from '@angular/core';
import { UserManageRouting } from './user-manage.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../shared/directives/modal.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SelectModule } from 'ng-select';
import { UserManageComponent } from './user-manage.component';
import { UserEditComponent } from './edit-user.component';
import { CommonService } from '../shared/services/common.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared.module';


@NgModule({
    imports: [
        CommonModule,
        UserManageRouting,
        FormsModule,
        ModalModule,
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
        NgxDatatableModule,
        SharedModule
    ],
    declarations: [
        UserManageComponent,
        UserEditComponent,
    ],
    providers: [
       // UserService,
        CommonService,
    ]
})

export class UserManageModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-user.json");
}