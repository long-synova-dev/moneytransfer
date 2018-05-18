import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IOption } from 'ng-select';

import { UserService } from '../../../shared/services/user.service';
import { DataService } from '../../../shared/services/data.service';
import { TaskService } from '../../../shared/services/task.service';
import { HistoryService } from '../../../shared/services/history.service';
import { DocumentType } from '../../../shared/models/EnumType';
import { DateFormatPipe} from '../../../shared/pipes/dateformat.pipes'

@Component({
    templateUrl: './detail.component.html'
})

export class ProcessesDetailComponent implements OnInit {

    taskDetail;
    readyToLoad:boolean = false;
    defineUserInCompany: Array<IOption>;
    defineTaskStatus: Array<IOption> = [
        {label: 'New', value: '1'},
        {label: 'Schedule', value: '2'},
        {label: 'In progress', value: '3'},
        {label: 'Pending review', value: '4'},
        {label: 'Reject', value: '5'},
        {label: 'Done', value: '6'}
    ];
    listHistory: any=[];

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _taskService: TaskService,
        private _userService: UserService,
        private _historyService: HistoryService,
        public _dialogRef: MatDialogRef<ProcessesDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    ngOnInit() {
        this._taskService.getTaskDetail(this.data.taskId)
            .then(response => {
                this.taskDetail = response;
                // conver to string
                if (response.taskStatus == 0) {response.taskStatus = 1;}
                this.taskDetail.taskStatus = response.taskStatus.toString();
                this.readyToLoad = true;
            });

        this._userService.getUsersInCompany()
            .then(data => {
                let defineValue = data;
                defineValue.forEach(element => {
                    element.value = element.value.toLowerCase();
                });
                this.defineUserInCompany = defineValue;
            });
            let model = {
                type: DocumentType.Task,
                referId: this.data.taskId
            }
        this._historyService.getHistory(model)
        .then(history=>{
            this.listHistory = history;
        });

    }

    clickSave() {
        let data = {reload: true};
        this._taskService.updateTaskDetail(this.taskDetail)
            .then(response => {
                this._dialogRef.close(data);
            })
    }

    clickCancel() {
        let data = {reload: false};
        this._dialogRef.close(data);
    }
}