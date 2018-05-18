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
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var dotest_service_1 = require("../services/dotest.service");
var pager_service_1 = require("../services/pager.service");
var shared_data_1 = require("../shared/shared.data");
var DoTestComponent = (function () {
    function DoTestComponent(_doTestService, _pagerService, _dialog, _sharedData, _router) {
        this._doTestService = _doTestService;
        this._pagerService = _pagerService;
        this._dialog = _dialog;
        this._sharedData = _sharedData;
        this._router = _router;
        this.title = 'Do Test';
        this.pager = {};
        this.isCanGoNext = false;
        this.numOfDone = 0;
        this.curPage = global_1.Global.ALL_OTHER_PAGES;
    }
    DoTestComponent.prototype.ngOnInit = function () {
        var _this = this;
        var savedData = this._sharedData.getAllAnswerData();
        if (savedData.length == 0) {
            this._doTestService.getQuestionData(global_1.Global.GET_QUESTIONS_DATA_URL)
                .subscribe(function (result) {
                _this.allItems = result;
                _this.totalPages = _this.allItems.length + global_1.Global.ALL_OTHER_PAGES;
                _this.setPage(1);
            });
            this._doTestService.addDoTest()
                .subscribe(function (result) {
            });
        }
        else {
            this.allItems = savedData;
            this.totalPages = this.allItems.length + global_1.Global.ALL_OTHER_PAGES;
            this.isCanGoNext = true;
            this.setPage(1);
        }
    };
    DoTestComponent.prototype.setPage = function (question) {
        if (question < 1 || question > this.pager.totalPages) {
            return;
        }
        this.pager = this._pagerService.getPager(this.allItems.length, question);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.curPage = question + 1;
    };
    DoTestComponent.prototype.answerChanged = function (choiceID, questionItem) {
        for (var _i = 0, _a = questionItem.Choices; _i < _a.length; _i++) {
            var choice = _a[_i];
            if (choice.Id == choiceID) {
                choice.IsSelected = true;
            }
            else {
                choice.IsSelected = false;
            }
        }
        var curQuestion = this.pager.currentPage;
        if (this.numOfDone < curQuestion) {
            this.numOfDone++;
        }
        if (curQuestion == this.allItems.length) {
            this._sharedData.saveAllAnswerData(this.allItems);
            this.gotoSubmitTest();
        }
        else {
            this.setPage(curQuestion + 1);
        }
    };
    DoTestComponent.prototype.gotoSubmitTest = function () {
        var doTest = {
            IsCompleted: true,
            IsReceivedPDF: false,
            Point: 0
        };
        this._doTestService.updateDoTest(doTest)
            .subscribe(function (result) {
        });
        this._doTestService.addAnonymous(this.allItems).subscribe(function (result) {
        });
        this._router.navigate(['gdprtest/submit']);
    };
    return DoTestComponent;
}());
DoTestComponent = __decorate([
    core_1.Component({
        selector: 'app-doTest',
        templateUrl: 'questionsliz/doTest/doTest.component.html'
    }),
    __metadata("design:paramtypes", [dotest_service_1.DoTestService, pager_service_1.PagerService, material_1.MdDialog,
        shared_data_1.SharedService, router_1.Router])
], DoTestComponent);
exports.DoTestComponent = DoTestComponent;
//# sourceMappingURL=doTest.component.js.map