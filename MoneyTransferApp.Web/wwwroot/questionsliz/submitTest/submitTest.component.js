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
var global_1 = require("../shared/global");
var forms_1 = require("@angular/forms");
var shared_data_1 = require("../shared/shared.data");
var dotest_service_1 = require("../services/dotest.service");
var router_1 = require("@angular/router");
var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var CVR_REGEX = /^\d{8}$/;
var SubmitTestComponent = (function () {
    function SubmitTestComponent(_router, _doTestService, _sharedService) {
        this._router = _router;
        this._doTestService = _doTestService;
        this._sharedService = _sharedService;
        this.title = 'Submit Test';
        this.isReceivePDF = true;
        this.isGet3Months = true;
        this.isDisabledAll = false;
        console.log('SubmitTestComponent -> constructor');
    }
    SubmitTestComponent.prototype.ngOnInit = function () {
        this.allAnswers = this._sharedService.getAllAnswerData();
        this.totalPages = this.allAnswers.length + global_1.Global.ALL_OTHER_PAGES;
        this.emailFormControl = new forms_1.FormControl('', [
            forms_1.Validators.required,
            forms_1.Validators.pattern(EMAIL_REGEX)
        ]);
        this.nameFormControl = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.compFormControl = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.cvrFormControl = new forms_1.FormControl('', [forms_1.Validators.pattern(CVR_REGEX)]);
    };
    SubmitTestComponent.prototype.getValidation = function () {
        if (this.nameFormControl.status == "INVALID" || this.compFormControl.status == "INVALID" || this.cvrFormControl.status == "INVALID" || this.emailFormControl.status == "INVALID") {
            return false;
        }
        else
            return true;
    };
    SubmitTestComponent.prototype.sendEmail = function () {
        var _this = this;
        this.setFormDisable();
        var user = {
            Name: this.txtName,
            Email: this.txtEmail,
            CompanyName: this.txtCompName,
            CompanyVat: this.txtCVR,
            IsUseFreeAcc: this.isGet3Months,
            IsNewsLetter: this.isReceiveNews
        };
        var doTest = {
            IsCompleted: true,
            IsReceivedPDF: this.isReceivePDF,
            Point: 0
        };
        this._doTestService.postTestData(user, doTest, this.allAnswers)
            .subscribe(function (result) {
            if (result.json() == "OK") {
                _this._router.navigate(['gdprtest/success']);
            }
            else {
                _this._router.navigate(['gdprtest/failed']);
            }
        });
    };
    SubmitTestComponent.prototype.setFormDisable = function () {
        this.isDisabledAll = true;
        this.nameFormControl.disable();
        this.cvrFormControl.disable();
        this.emailFormControl.disable();
        this.compFormControl.disable();
    };
    SubmitTestComponent.prototype.receiveNews = function (isReceiveNews) {
        this.isReceiveNews = isReceiveNews;
        jQuery('.form-info').on('shown.bs.modal', function (e) {
            jQuery('.form-group input').on('keyup', function () {
                var str = jQuery(this).val();
                if (str == '') {
                    jQuery(this).val(str.substring(0, str.length - 1));
                }
            });
        });
    };
    SubmitTestComponent.prototype.reviewAnswer = function () {
        this._router.navigate(['gdprtest/dotest']);
    };
    return SubmitTestComponent;
}());
SubmitTestComponent = __decorate([
    core_1.Component({
        selector: 'app-submitTest',
        templateUrl: 'questionsliz/submitTest/submitTest.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router, dotest_service_1.DoTestService, shared_data_1.SharedService])
], SubmitTestComponent);
exports.SubmitTestComponent = SubmitTestComponent;
//# sourceMappingURL=submitTest.component.js.map