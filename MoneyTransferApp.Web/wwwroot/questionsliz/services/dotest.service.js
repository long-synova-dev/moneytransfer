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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var global_1 = require("../shared/global");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var DoTestService = (function () {
    function DoTestService(_http) {
        this._http = _http;
        this.data = [];
    }
    DoTestService.prototype.getQuestionData = function (url) {
        return this._http.get(url)
            .map(function (response) {
            return JSON.parse(response.json());
        });
    };
    ;
    DoTestService.prototype.postTestData = function (user, doTest, answers) {
        var url = global_1.Global.POST_DOTEST_DATA_URL;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var submitData = { "UserInfoModel": user, "DoTestModel": doTest, "AnswersList": answers };
        var body = JSON.stringify(submitData);
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, body, options)
            .map(function (response) {
            return response;
        });
    };
    ;
    DoTestService.prototype.addDoTest = function () {
        var url = global_1.Global.ADD_DOTEST_DATA_URL;
        return this._http.get(url)
            .map(function (response) {
            return response;
        });
    };
    DoTestService.prototype.updateDoTest = function (doTest) {
        var url = global_1.Global.PUT_DOTEST_DATA_URL;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var submitData = JSON.stringify(doTest);
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.put(url, submitData, options)
            .map(function (response) {
            return response;
        });
    };
    DoTestService.prototype.addAnonymous = function (answers) {
        var url = global_1.Global.ADD_ANONYMOUS_DATA_URL;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var submitData = JSON.stringify(answers);
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, submitData, options)
            .map(function (response) {
            return response;
        });
    };
    DoTestService.prototype.downloadPDF = function (url, fileName) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var body = JSON.stringify(fileName);
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, body, options)
            .map(function (response) { return response; })
            .subscribe(function (data) { return data.text(); });
    };
    DoTestService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    return DoTestService;
}());
DoTestService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], DoTestService);
exports.DoTestService = DoTestService;
//# sourceMappingURL=dotest.service.js.map