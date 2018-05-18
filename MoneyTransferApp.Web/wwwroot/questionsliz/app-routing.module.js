"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var doTest_component_1 = require("./doTest/doTest.component");
var submitTest_component_1 = require("./submitTest/submitTest.component");
var success_component_1 = require("./finishTest/success.component");
var failed_component_1 = require("./finishTest/failed.component");
exports.routes = [
    { path: 'gdprtest/dotest', component: doTest_component_1.DoTestComponent },
    { path: 'gdprtest/submit', component: submitTest_component_1.SubmitTestComponent },
    { path: 'gdprtest/success', component: success_component_1.SuccessComponent },
    { path: 'gdprtest/failed', component: failed_component_1.FailedComponent },
    { path: '*', component: doTest_component_1.DoTestComponent },
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(exports.routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map