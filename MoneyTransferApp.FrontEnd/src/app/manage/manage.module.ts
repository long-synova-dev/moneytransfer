import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomerService } from '../shared/services/customer.service';
import { ManageComponent } from './manage.component';
import { ManageRouting } from './manage.routing';
import { EditCustomerComponent } from './customer/customer-edit.component';
import { CustomerManagement } from './customer/customer-management.component';
import { ModalModule } from '../shared/directives/modal.module';
import { SelectModule } from 'ng-select';

@NgModule({
    imports: [
        CommonModule,
        ManageRouting,
        ChartsModule,
        FormsModule,
        ModalModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        NgxDatatableModule,
        SelectModule
    ],
    declarations: [
        ManageComponent,
        CustomerManagement,
        EditCustomerComponent
    ],
    providers: [
        CustomerService
    ]
})

export class ManageModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-home.json");
}