import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IOption } from 'ng-select';

import { TaskService } from '../../shared/services/task.service';
import { UserService } from '../../shared/services/user.service';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../shared/services/alert.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TaskStatus } from '../../shared/models/EnumType';
import { CompanyTagService } from '../../shared/services/company-tag.service';
import { Common } from '../../shared/global/common';
import { Globals } from '../../shared/global/global';

@Component({
    templateUrl: './tasks-management.component.html',
    styleUrls: ['../tasks.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ]
})

export class TasksManagementComponent implements OnInit {
    currStatus: any;
    userInfo: any;
    todoNameInput;
    taskManagementForm: FormGroup;
    controlsFormGroup: FormGroup;
    todoFormGroup: FormGroup;
    isUpdate: boolean = false;
    endDayDisable: boolean = false;
    listTodos: Array<any> = [];
    defineProcess: Array<IOption> = [];
    defineUserInCompany: Array<IOption> = [];
    defineRisks: Array<IOption>;
    isDisableNeverEnd: boolean = true;
    minDate = new Date();

    defineScheduleTypes: Array<IOption>;
    definePeriods: Array<IOption>;
    defineControlAssercertions: Array<IOption>;
    //  = [
    //     { label: 'Completeness', value: '1' },
    //     { label: 'Existence', value: '2' },
    //     { label: 'Accuracy', value: '3' },
    //     { label: 'Valuation', value: '4' },
    //     { label: 'Ownership', value: '5' },
    //     { label: 'Presentation', value: '6' },
    // ];

    currentUserId: string;
    todoBtnText: any;
    updatevalue: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _data: DataService,
        private _taskService: TaskService,
        private _userService: UserService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _alert: AlertService,
        private adapter: DateAdapter<any>,
        private _tagService: CompanyTagService,
        private _common: Common
    ) { };

    ngOnInit() {
        let language = JSON.parse(localStorage.getItem('lang'));
        this.adapter.setLocale(language.languageCode);
        this.currentUserId = localStorage.getItem("uid");
        
        this._translate.get('Management.Daily').subscribe(daily => {
            this._translate.get('Management.Weekly').subscribe(weekly => {
                this._translate.get('Management.Monthly').subscribe(monthly => {
                    this._translate.get('Management.Quarterly').subscribe(quarterly => {
                        this._translate.get('Management.Half-yearly').subscribe(halfYearly => {
                            this._translate.get('Management.Yearly').subscribe(yearly => {
                                this.defineScheduleTypes = [
                                    { label: daily, value: '1' },
                                    { label: weekly, value: '2' },
                                    { label: monthly, value: '3' },
                                    { label: quarterly, value: '4' },
                                    { label: halfYearly, value: '5' },
                                    { label: yearly, value: '6' }
                                ];
                            });
                        });
                    });
                });
            });
        });
        
      
        this._translate.get('Management.WorkDay(s)').subscribe(workdays => {
            this.definePeriods = [
                { label: '+ 1 ' + workdays, value: '1' },
                { label: '+ 2 ' + workdays, value: '2' },
                { label: '+ 3 ' + workdays, value: '3' },
                { label: '+ 4 ' + workdays, value: '4' },
                { label: '+ 5 ' + workdays, value: '5' },
                { label: '+ 6 ' + workdays, value: '6' },
                { label: '+ 7 ' + workdays, value: '7' },
                { label: '+ 8 ' + workdays, value: '8' },
                { label: '+ 9 ' + workdays, value: '9' },
                { label: '+ 10 ' + workdays, value: '10' },
                { label: '+ 11 ' + workdays, value: '11' },
                { label: '+ 12 ' + workdays, value: '12' },
                { label: '+ 13 ' + workdays, value: '13' },
                { label: '+ 14 ' + workdays, value: '14' },
                { label: '+ 15 ' + workdays, value: '15' },
                { label: '+ 16 ' + workdays, value: '16' },
                { label: '+ 17 ' + workdays, value: '17' },
                { label: '+ 18 ' + workdays, value: '18' },
                { label: '+ 19 ' + workdays, value: '19' },
                { label: '+ 20 ' + workdays, value: '20' },
                { label: '+ 21 ' + workdays, value: '21' },
                { label: '+ 22 ' + workdays, value: '22' },
                { label: '+ 23 ' + workdays, value: '23' },
                { label: '+ 24 ' + workdays, value: '24' },
                { label: '+ 25 ' + workdays, value: '25' },
                { label: '+ 26 ' + workdays, value: '26' },
                { label: '+ 27 ' + workdays, value: '27' },
                { label: '+ 28 ' + workdays, value: '28' },
                { label: '+ 29 ' + workdays, value: '29' },
                { label: '+ 30 ' + workdays, value: '30' }
            ];
        });



        this._taskService.getProcessOptions()
            .then(data => { this.defineProcess = data; });

        this._taskService.getRiskOptions()
            .then(data => { this.defineRisks = data; });

        this._userService.getUsersInCompany()
            .then(data => {
                let defineValue = data;
                defineValue.forEach(element => {
                    element.value = element.value.toLowerCase();
                });
                this.defineUserInCompany = defineValue;
            });
        this._tagService.getTagsByCategory(Globals.CATEGORY_CONTROL_ASSERTION, false)
            .then(data => this.defineControlAssercertions = Common.convertResponseToOptions(data));

        this._activatedRoute.params.subscribe(params => {
            if (params && params.id) {
                this.formInit('');
                this.isUpdate = true;
                this._taskService.getTaskById(params.id)
                    .then(data => {
                        this.currStatus = data.taskStatus;
                        this.formInit(data);
                        this.taskManagementForm.addControl('taskId', new FormControl(params.id, Validators.required));
                        this.listTodos = data.todos;
                        this.isRecurringChange(data);
                        this.isScheduleNeverEndChange(data);
                        this.enableTaskReviewChange(data);
                    });
            } else {
                this.formInit('');
            }
        });
    };

    formInit(data) {
        if (data.startDate && data.isPublished) {
            this.minDate = new Date(data.startDate);
        }
        this.taskManagementForm = this._formBuilder.group({
            'taskTitle': [data && data.taskTitle ? data.taskTitle : '', Validators.required],
            'taskDescription': [data && data.taskDescription ? data.taskDescription : '', Validators.required],
            'isControl': [data && data.isControl ? data.isControl : false],
            'process': [data && data.process ? data.process : '', Validators.required],
            'risk': [data && data.risk ? data.risk : '', Validators.required],
            'taskPerformerId': [data && data.taskPerformerId ? data.taskPerformerId : this.currentUserId, Validators.required],
            'taskResponsibleId': [data && data.taskResponsibleId ? data.taskResponsibleId : '', Validators.required],
            'startDate': [data && data.startDate ? data.startDate : '', Validators.required],
            'endDate': [data && data.endDate ? data.endDate : '', Validators.required],
            'neverEnd': [data && data.neverEnd ? true : false],
            'isRecurring': [data && data.isRecurring ? data.isRecurring : false],
            'performerDeadlineId': [data && data.performerDeadlineId ? data.performerDeadlineId : '5', Validators.required],
            'enableTaskReview': [data && data.enableTaskReview ? data.enableTaskReview : false],
            'isPublished': [data && data.isPublished ? data.isPublished : false]
        });
        if (data.isControl) {
            this.isControlChange(data);
        }
        this.todoFormGroup = this._formBuilder.group({
            'title': ['', Validators.required],
            'requireDocumentation': [false]
        });

        this._translate.get('Management.AddTodo').subscribe(item => {
            this.todoBtnText = item;
        });
    };

    isControlChange(data) {
        let isTrue = this.taskManagementForm.controls['isControl'].value;
        if (!isTrue) {
            this.taskManagementForm.removeControl('controlType1Id');
            this.taskManagementForm.removeControl('controlType2Id');
            this.taskManagementForm.removeControl('controlAssertionIds');
        } else {
            this.taskManagementForm.addControl('controlType1Id', new FormControl(data && data.controlType1Id ? data.controlType1Id : null, Validators.required));
            this.taskManagementForm.addControl('controlType2Id', new FormControl(data && data.controlType2Id ? data.controlType2Id : null, Validators.required));
            this.taskManagementForm.addControl('controlAssertionIds', new FormControl(data && data.controlAssertionIds ? data.controlAssertionIds : null, Validators.required));
        }
    };

    enableTaskReviewChange(data) {
        let isTrue = this.taskManagementForm.controls['enableTaskReview'].value;
        if (!isTrue) {
            this.taskManagementForm.removeControl('taskReviewerId');
            this.taskManagementForm.removeControl('reviewerDueDateId');
        } else {
            this.taskManagementForm.addControl('taskReviewerId', new FormControl(data && data.taskReviewerId ? data.taskReviewerId : this.currentUserId, Validators.required));
            this.taskManagementForm.addControl('reviewerDueDateId', new FormControl(data && data.reviewerDueDateId ? data.reviewerDueDateId : '3', Validators.required));
        }
    }
    isRecurringChange(data) {
        let isTrue = this.taskManagementForm.controls['isRecurring'].value;
        if (!isTrue) {
            this.taskManagementForm.removeControl('scheduleTypeId');
            this.isDisableNeverEnd = true;
            this.taskManagementForm.controls['neverEnd'].setValue(false);
            this.isScheduleNeverEndChange(null);
        } else {
            this.isDisableNeverEnd = false;
            this.taskManagementForm.addControl('scheduleTypeId', new FormControl(data && data.scheduleTypeId ? data.scheduleTypeId : null, Validators.required));
        }
    }
    isScheduleNeverEndChange(data) {
        let isTrue = this.taskManagementForm.controls['neverEnd'].value;
        if (!isTrue) {
            this.endDayDisable = false;
            this.taskManagementForm.controls['endDate'].reset({ value: data && data.endDate ? data.endDate : '', disabled: false });
        } else {
            this.endDayDisable = true;
            this.taskManagementForm.controls['endDate'].reset({ value: '', disabled: true });
        }
    }
    addTodo() {
        let formValidated = this.todoFormGroup.valid;
        let formValue = this.todoFormGroup.value;
        if (formValidated) {
            let nameControl = this.todoFormGroup.controls['title'];
            let isMatchName = this.listTodos.find(item => item.title == nameControl.value);
            if (isMatchName) {
                this._translate.get('Management.DupName').subscribe(value => this._alert.error(value));
                return;
            }
            this.listTodos.push(formValue);
            console.log(this.listTodos);

            nameControl.setValue('');
            this.todoFormGroup.markAsUntouched();

        } else {
            this.todoFormGroup.touched;
        }
    }
    updateTodo(item) {
        let formValidated = this.todoFormGroup.valid;
        if (formValidated) {

            let index = this.listTodos.indexOf(item);
            let formValue = this.todoFormGroup.value;
            var matchItem = this.listTodos.find(i => i.title == formValue.title && i.title != item.title);
            if (matchItem) {
                this._translate.get('Management.DupName').subscribe(value => this._alert.error(value));
                return;
            }

            this.listTodos[index] = formValue;

            this._translate.get('Management.AddTodo').subscribe(s => {
                this.todoBtnText = s;
                this.updatevalue = null;
            });

            let nameControl = this.todoFormGroup.controls['title'];
            nameControl.setValue('');
            this.todoFormGroup.markAsUntouched();
        } else {
            this.todoFormGroup.touched;
        }
    }

    deteleTodo(item) {
        this.listTodos = this.listTodos.filter(indexItem => indexItem.title !== item.title);
    }

    editTodo(item) {
        let title = item.title.trim();
        this.todoFormGroup.controls['title'].setValue(title);
        this.todoFormGroup.controls['requireDocumentation'].setValue(item.requireDocumentation);

        let isMatchName = this.listTodos.find(i => i.title == title);
        this._translate.get('Management.UpdateTodo').subscribe(s => {
            this.todoBtnText = s;
            this.updatevalue = item;
        });
        // if(isMatchName)
        // {
        //     this._translate.get('Management.DupName').subscribe(value=> this._alert.error(value));
        // }

    }

    updateTodoList() {
        if (this.updatevalue) {
            this.updateTodo(this.updatevalue);

        }
        else {
            this.addTodo();
        }
    }

    uploadFile() {

    }

    saveTask() {
        this._data.changeLoadStatus(true);
        let isFormValid = this.taskManagementForm.valid;
        if (isFormValid && this.listTodos.length !== 0) {
            let taskInfo = this.taskManagementForm.value;
            // If Published is set => set the new/proposed task to Scheduled.
            if (taskInfo.isPublished) {
                if (this.currStatus == null || this.currStatus == 0 || this.currStatus == TaskStatus.New) {
                    taskInfo.taskStatus = TaskStatus.Scheduled;
                }
                else {
                    taskInfo.taskStatus = this.currStatus;
                }
            }
            else {
                taskInfo.taskStatus = this.currStatus == null ? TaskStatus.New : this.currStatus;
            }
            taskInfo.todos = this.listTodos;

            if (this.isUpdate) {
                this._data.changeLoadStatus(false);
                this._taskService.updateTask(taskInfo).then(s => {
                    this._router.navigate(['gdpr', 'management', 'processes']);
                    this._translate.get('Management.SavedSuccessfully').subscribe(value => this._alert.success(value));
                });

            } else {
                this._data.changeLoadStatus(false);
                this._taskService.addNewTask(taskInfo).then(s => {
                    this._router.navigate(['gdpr', 'management', 'processes']);
                    this._translate.get('Management.SavedSuccessfully').subscribe(value => this._alert.success(value));
                });

            }

        } else {

            if (isFormValid && this.listTodos.length == 0) {
                this._data.changeLoadStatus(false);
                this._translate.get('Management.ValidationNoToDos').subscribe(value => this._alert.error(value));
                return;
            }
            this.validateAllForm(this.taskManagementForm);
            this._data.changeLoadStatus(false);
            this._translate.get('Management.ValidationError').subscribe(value => this._alert.error(value));
        }

    }

    validateAllForm(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            let form = formGroup.get(field);
            if (form instanceof FormControl) {
                form.markAsTouched({ onlySelf: true });
            };
            if (form instanceof FormGroup) {
                this.validateAllForm(form);
            };
            if (form instanceof FormArray) {
                let groupOfArray = form.controls;
                groupOfArray.forEach((group) => {
                    if (group instanceof FormGroup) {
                        this.validateAllForm(group);
                    }
                })
            }
        })
    }
    // changeProcess() {
    //     let process = this.taskManagementForm.controls['process'].value;

    //     this._taskService.getRiskOptions(process)
    //         .then(risks => {
    //             this.taskManagementForm.controls['risk'].setValue('');
    //             this.defineRisks = risks;
    //         });
    // }
    moveUp(item) {
        let index = this.listTodos.indexOf(item);
        let temp = this.listTodos[index - 1];
        if (index > 0) {
            this.listTodos[index - 1] = item;
            this.listTodos[index] = temp;
        }
    }
    moveDown(item) {
        let index = this.listTodos.indexOf(item);
        let l = this.listTodos.length;
        let temp = this.listTodos[index + 1];
        if (index < l - 1) {
            this.listTodos[index + 1] = item;
            this.listTodos[index] = temp;
        }
        console.log(this.listTodos);
    }
}