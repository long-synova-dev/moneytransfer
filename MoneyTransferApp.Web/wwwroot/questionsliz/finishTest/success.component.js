"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var shared_data_1 = require("../shared/shared.data");
var router_1 = require("@angular/router");
var SuccessComponent = (function () {
    function SuccessComponent(_router, _sharedDataService) {
        this._router = _router;
        this._sharedDataService = _sharedDataService;
    }
    SuccessComponent.prototype.ngOnInit = function () {
    };
    SuccessComponent.prototype.doTestAgain = function () {
        this._sharedDataService.saveAllAnswerData([]);
        this._router.navigate(['gdprtest/dotest']);
    };
    SuccessComponent.prototype.gotoHome = function () {
        this._router.navigate(['/']);
    };
    return SuccessComponent;
}());
SuccessComponent = __decorate([
    core_1.Component({
        selector: 'app-success',
        templateUrl: "questionsliz/finishTest/success.component.html"
    }),
    __metadata("design:paramtypes", [router_1.Router, shared_data_1.SharedService])
], SuccessComponent);
exports.SuccessComponent = SuccessComponent;
//# sourceMappingURL=success.component.js.map