import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomerService } from '../shared/services/customer.service';
import { HomeComponent } from './home.component';
import { HomeRouting } from './home.routing';
import { EditCustomerComponent } from './customer/customer-edit.component';
import { CustomerManagement } from './customer/customer-management.component';


@NgModule({
    imports: [
        CommonModule,
        HomeRouting,
        ChartsModule,
        FormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        NgxDatatableModule
    ],
    declarations: [
        HomeComponent,
        CustomerManagement,
        EditCustomerComponent
    ],
    providers: [
        CustomerService
    ]
})

export class HomeModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-home.json");
}