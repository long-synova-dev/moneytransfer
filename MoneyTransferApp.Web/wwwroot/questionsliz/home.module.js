"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
var animations_1 = require("@angular/platform-browser/animations");
var app_routing_module_1 = require("./app-routing.module");
var home_component_1 = require("./home.component");
var doTest_component_1 = require("./doTest/doTest.component");
var submitTest_component_1 = require("./submitTest/submitTest.component");
var success_component_1 = require("./finishTest/success.component");
var failed_component_1 = require("./finishTest/failed.component");
var dotest_service_1 = require("./services/dotest.service");
var pager_service_1 = require("./services/pager.service");
var shared_data_1 = require("./shared/shared.data");
var HomeModule = (function () {
    function HomeModule() {
    }
    return HomeModule;
}());
HomeModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule,
            material_1.MaterialModule,
            material_1.MdInputModule,
            material_1.MdButtonModule,
            material_1.MdProgressSpinnerModule,
            animations_1.BrowserAnimationsModule
        ],
        declarations: [
            home_component_1.HomeComponent,
            doTest_component_1.DoTestComponent,
            submitTest_component_1.SubmitTestComponent,
            success_component_1.SuccessComponent,
            failed_component_1.FailedComponent
        ],
        bootstrap: [home_component_1.HomeComponent],
        providers: [dotest_service_1.DoTestService, pager_service_1.PagerService, shared_data_1.SharedService]
    })
], HomeModule);
exports.HomeModule = HomeModule;
//# sourceMappingURL=home.module.js.map