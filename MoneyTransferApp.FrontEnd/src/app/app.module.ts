import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, Type, enableProdMode, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';

import { AppRouting } from './app.routing.module';
import { AuthGuard, AuthGuardComponent } from './shared/guards/authenticator.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { DataService } from './shared/services/data.service';
import { HttpCustomInterceptor } from './shared/interceptors/http-custom.interceptor';

import { AlertComponent } from './shared/directives/alert.component';
import { AlertService } from './shared/services/alert.service';
import { SessionManagementService } from './shared/services/session-management.service';
import { NotFoundComponent } from './404.component';
import { NotHavePermissionComponent } from './403.component';
import { ScriptLoaderService } from './shared/services/load-script.service';
import { CommonService } from './shared/services/common.service';
import { IntercomModule } from 'ng-intercom';
import { ModalModule } from './shared/directives/modal.module';
import { UserSettingComponent } from './user-setting/user-setting.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeModule } from './home/home.module';

@NgModule({
    imports: [
        CommonModule,
        HomeModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRouting,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          },
          isolate: true
        }),
        HttpModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        IntercomModule.forRoot({
            appId: "jj681aiq",
            updateOnRouterChange: true
        }),
        ModalModule,
        MatExpansionModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        UserSettingComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "en-US" },
        AlertService,
        AuthGuard,
        AuthGuardComponent,
        RoleGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCustomInterceptor,
            multi: true,
        },
        DataService,
        UserService,
        SessionManagementService,
        ScriptLoaderService,
        CommonService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-app.json");
}