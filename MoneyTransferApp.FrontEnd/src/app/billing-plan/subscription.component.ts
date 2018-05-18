import { DOCUMENT } from '@angular/platform-browser';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillingPlanService } from '../shared/services/billing-plan.service';
import { DataService } from '../shared/services/data.service';
import { AlertService } from '../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import { ModalComponent } from '../shared/directives/modal.component';
import { ModalDialog } from '../shared/models/modal-dialog.model';
import { fadeTransition } from '../animations/fade-transition';
import { MatDialog } from '@angular/material';
import { CancelSubscriptionComponent } from './cancel-subscription.component';
import { UnableDowngradeSubscriptionComponent } from './unable-downgrade-subscription.component';
import {DateFormatPipe} from '../shared/pipes/dateformat.pipes'

@Component({
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.css'],
    animations: [fadeTransition()],
    host: { '[@fadeTransition]': '' }
})

export class SubscriptionComponent implements OnInit {
    ready;
    billingPlans;
    selectedPlan;
    currentStatus;
    currentPlanOrder = 0;
    card;
    listAddOns;
    currentAddOns: Array<any> = [];
    changeCurrentPlanBtn: boolean = false;
    selectedUserAddOns;
    selectedSedaAddOns;
    billingPlansFilter = { frequency: "monthly" };
    addOnsFilter = { addOnFrequency: "monthly" };
    frequency: boolean = false;
    confirmDialog: ModalDialog;
    lang;
    isViewCurrentPlan: boolean = false;
    couponCode;
    selectedCouponCode;

    constructor(
        private _billingPlanService: BillingPlanService,
        private _data: DataService,
        private _alert: AlertService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _translate: TranslateService,
        private _matDialog: MatDialog,
        @Inject(DOCUMENT) private _document: Document
    ) {
        let subscription = Observable.interval(200).subscribe(() => {
            let node = document.getElementById('reepay-card-token');
            if (!node) {
                subscription.unsubscribe();
            } else {
                let element = <HTMLInputElement>node;
                if (!!element.value) {
                    this.submit(element.value);
                    document.getElementById('reepay-card-token')["value"] = "";
                }
            }
        });
    }

    ngOnInit(): void {
        this._data.changeLoadStatus(true);
        this._translate.get('Subscription.ConfirmYourSubscription').subscribe(value => this.confirmDialog = new ModalDialog(value, 'modal-lg', false));
        let locale = localStorage.getItem("lang");
        this.lang = 'en';
        if (locale) {
            this.lang = JSON.parse(locale).languageCode.split('-')[0];
        }
        window['reepaytoken'].configure({
            key: window['reepayDK'],
            language: this.lang,
            ready: function () {
            },
            token: function (result) {
            },
            close: function () {
            }
        });
        // Load current status
        this._billingPlanService.getCurrentStatus()
            .then(data => {
                console.log('currentstatus', data);
                this.currentStatus = data;
                this.ready = true;
                // Load billingplan
                this._billingPlanService.getBillingPlan()
                    .then(data => {
                        this.billingPlans = data;
                        let currentPlan = data.filter(p => p.isCurrent)[0];

                        if (currentPlan) {
                            this.currentPlanOrder = currentPlan.order;
                        }

                        this._activatedRoute.params.subscribe(params => {
                            let planId = params.plan;
                            if (planId === 'current') {
                                this.purchasePlan(currentPlan);
                            }
                        });
                        if (this.currentStatus.isCancelled) {
                            let currentPlan = this.billingPlans.filter(item => item.billingPlanId == this.currentStatus.currentPlan);
                            currentPlan[0].isCancelled = true;
                            this._activatedRoute.queryParams.subscribe(result => {
                                if (result.q == "resubcribe") {
                                    this.onClickPurchasePlan(currentPlan[0])
                                }
                            });
                        };
                        // Load billingplan
                        this._billingPlanService.getAddonsPlan()
                            .then(data => {
                                let addOns = data;
                                addOns.forEach(element => {
                                    element.isChecked = false;
                                });
                                this.listAddOns = data;
                                this.listAddOns.unshift({ reepayAddOnId: "user_remove_addon", addOnType: "user", amount: 0, addOnFrequency: "monthly" });
                                this.listAddOns.unshift({ reepayAddOnId: "user_remove_addon", addOnType: "user", amount: 0, addOnFrequency: "yearly" });
                                this.listAddOns.unshift({ reepayAddOnId: "seda_remove_addon", addOnType: "seda", amount: 0, addOnFrequency: "monthly" });
                                this.listAddOns.unshift({ reepayAddOnId: "seda_remove_addon", addOnType: "seda", amount: 0, addOnFrequency: "yearly" });

                                this.billingPlans.forEach(plan => {
                                    if (this.currentStatus.noOfProcesses > plan.maximumProcesses ||
                                        this.currentStatus.noOfStorage > plan.maximumStorage ||
                                        this.currentStatus.noOfUsers > plan.maximumUsers) {
                                        plan.isDisabled = true;
                                    }
                                    if (plan.isCurrent) {
                                        // Clone list current addon
                                        this.currentStatus.currentAddOns.forEach(element => {
                                            this.currentAddOns.push(element);
                                        });
                                        // Push defaul value to clon list
                                        if (this.currentStatus.currentAddOns.length == 1) {
                                            let checkedRadio = this.listAddOns.find(item => item.reepayAddOnId == this.currentStatus.currentAddOns[0]);
                                            if (checkedRadio.addOnType == 'user') {
                                                this.currentAddOns.unshift('seda_remove_addon');
                                            } else {
                                                this.currentAddOns.unshift('user_remove_addon');
                                            }
                                        }
                                        this.clickPlan(plan);
                                    }
                                });
                                this._data.changeLoadStatus(false);
                            });
                    });
            })
    }

    setDefaultRadio(plan) {
        if (plan.isCurrent) {
            this.setCurrentAddOns();
        } else {
            this.resetRadioChecked();
            this.listAddOns.forEach(addOns => {
                if (addOns.amount == 0) {
                    addOns.isChecked = true;
                }
            });
        }
    }
    resetRadioChecked() {
        this.selectedSedaAddOns = undefined;
        this.selectedUserAddOns = undefined;
        this.listAddOns.forEach(addOns => {
            addOns.isChecked = false;
        });
    }
    setCurrentAddOns() {
        this.resetRadioChecked();
        this.currentAddOns.forEach(element => {
            let currentAddons = this.listAddOns.find(item => item.reepayAddOnId == element);
            currentAddons.isChecked = true;
            return currentAddons;
        });
    }

    frequencyChange() {
        if (this.frequency) {
            this.billingPlansFilter.frequency = "yearly";
            this.addOnsFilter.addOnFrequency = "yearly";
        } else {
            this.billingPlansFilter.frequency = "monthly";
            this.addOnsFilter.addOnFrequency = "monthly";
        }
    }

    onCheckAddOns(addOns, plan) {
        this.listAddOns.forEach(element => {
            if (element.addOnType == addOns.addOnType) {
                element.isChecked = false;
            }
        });
        addOns.isChecked = true;

        if (addOns.addOnType == 'user') {
            if (addOns.reepayAddOnId == "user_remove_addon") {
                this.selectedUserAddOns = undefined;
            } else {
                this.selectedUserAddOns = addOns;
            }
        } else if (addOns.addOnType == 'seda') {
            if (addOns.reepayAddOnId == "seda_remove_addon") {
                this.selectedSedaAddOns = undefined;
            } else {
                this.selectedSedaAddOns = addOns;
            }
        }

        if (plan.isCurrent) {
            let newAddonsList = [];
            this.listAddOns.forEach(element => {
                if (element.isChecked) {
                    newAddonsList.push(element.reepayAddOnId);
                }
            });
            let isEq = this.compareArray(newAddonsList, this.currentAddOns);
            if (isEq) {
                this.changeCurrentPlanBtn = false;
            } else { this.changeCurrentPlanBtn = true; }
        }
    }


    clickPlan(plan) {
        this.couponCode = null;
        this.selectedCouponCode = null;
        this.billingPlans.forEach(element => {
            element.isOpen = false;
        });
        plan.isOpen = true;
        this.setDefaultRadio(plan);
        this.changeCurrentPlanBtn = false;
    }
    onClickPurchasePlan(plan) {
        this._data.changeLoadStatus(true);
        let hasCouponCode = this.couponCode;
        if (hasCouponCode) {
            this.checkCoupon(plan);
        } else {
            this.purchasePlan(plan);
        }
    }
    checkCoupon(plan) {
        this._billingPlanService.getCouponInfo(this.couponCode, plan.billingPlanId)
            .then(response => {
                let isError = response.errors;
                if (isError) {
                    this._translate.get(isError).subscribe(value => this._alert.error(value));
                    this.couponCode = null;
                    this._data.changeLoadStatus(false);
                } else {
                    this.selectedCouponCode = response;
                    this.purchasePlan(plan);
                }
            })
    }
    purchasePlan(plan) {
        let hours = (+new Date(this.currentStatus.periodEndDate) - +new Date()) / 36e5;
        console.log(hours);
        if (plan.order < this.currentPlanOrder && hours > 24) {
            this._data.changeLoadStatus(false);
            let confirmDialog = this._matDialog.open(UnableDowngradeSubscriptionComponent, {
                width: '400px'
            });
            return;
        }
        
        this.selectedPlan = plan;
        this._billingPlanService.checkPaymentMethod()
            .then((result) => {
                if (result.cards && result.cards.length > 0) {
                    this.card = result.cards[0];
                }
                this.confirmDialog.visible = true;
                this._data.changeLoadStatus(false);
            });
    };

    viewCurrentPlan(plan) {
        this._data.changeLoadStatus(true);
        this.selectedPlan = plan;
        this._billingPlanService.checkPaymentMethod()
            .then((result) => {
                if (result.card && result.cards.length > 0) {
                    this.card = result.card[0];
                }
                this.confirmDialog.visible = true;
                this.isViewCurrentPlan = true;
                this._data.changeLoadStatus(false);
            });
    };
    cancelPlan() {
        let confirmDialog = this._matDialog.open(CancelSubscriptionComponent, {
            width: '400px'
        });
        confirmDialog.afterClosed().subscribe(result => {
            if (result) {
                this._billingPlanService.cancelSubscription()
                    .then(result => {
                        this.confirmDialog.visible = false;
                        this._router.navigate(['billing-plan', 'history']);
                    })
            }
        })
    }

    continue(openCardForm) {
        this.confirmDialog.visible = false;
        if (openCardForm) {
            window['reepaytoken'].open();
            return;
        }

        if (!!this.card) {
            this.submit('');
        } else {
            window['reepaytoken'].open();
        }
    }

    submit(cardToken) {
        this._data.changeLoadStatus(true);
        let obj = {
            'cardToken': cardToken,
            'planId': this.selectedPlan.billingPlanId,
            'addOnIds': [],
            'couponCodes': []
        };
        this.listAddOns.forEach(element => {
            if (element.isChecked && element.amount > 0) {
                obj['addOnIds'].push(element.reepayAddOnId);
            }
        });
        if (this.selectedCouponCode) { obj['couponCodes'].push(this.couponCode) }
        this._billingPlanService.changeSubscription(obj)
            .then((result) => {
                this._data.changeLoadStatus(false);
                if (result.error) {
                    this._alert.error(result.error, null, true, true);
                } else {
                    this._translate.get('Subscription.Sucessful').subscribe(value => this._alert.success(value, null, true, true));
                    for (let item in result) {
                        localStorage.setItem(item, result[item]);
                    }
                    // Remove reepay iframe
                    this._document.getElementById('reepay-token-iframe').remove();
                    this._router.navigate(['billing-plan', 'history']);
                }
            });
    }

    close() {
        this.confirmDialog.visible = false;
        this.isViewCurrentPlan = false;
        this.selectedCouponCode = null;
        this.couponCode = null;
    }

    compareArray(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
}