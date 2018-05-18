import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { TaskService } from '../../shared/services/task.service';
import { UserService } from '../../shared/services/user.service';
import { IOption } from 'ng-select';
import { AlertService } from '../../shared/services/alert.service';
import { MatDialog } from '@angular/material';
import { TaskType, TaskStatus } from '../../shared/models/EnumType';
import { ProcessesDetailComponent } from './detail/detail.component';
import { PerformDetailComponent } from '../../gdpr-tasks/perform/detail/detail.component';
import { ReviewDetailComponent } from '../../gdpr-tasks/review/detail/detail.component';

@Component({
    templateUrl: './processes.component.html',
    styleUrls: ['../management.component.css']
})

export class ProcessesComponent implements OnInit {
    taskFilter:any = {taskTitle: '', processId: null, isControl: null, taskPerformerId: null};
    checkboxTaskFilter = true;
    checkboxControlFilter = true;
    listProcesses = [];
    listTasks:any = [];
    defineUserInCompany: Array<IOption> = [];

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
        private _taskService: TaskService,
        private _userService: UserService,
        private _alert: AlertService,
        private _dialog: MatDialog
    ) {}
    
    ngOnInit() {
        this._taskService.getProcessOptions()
        .then(data => {
            this.listProcesses = data;
            console.log('process', data);
        });

        this._taskService.getAllTask()
        .then(data => {
            this.listTasks = data;
            console.log('tasks', data);
        });

        this._userService.getUsersInCompany()
        .then(data => {
            let defineValue = data;
            defineValue.forEach(element => {
                element.value = element.value.toLowerCase();
            });
            this.defineUserInCompany = defineValue;
        });
    }

    checkboxClick() {
        if (this.checkboxTaskFilter && this.checkboxControlFilter) {
            this.taskFilter.isControl = null;
        }
        if (!this.checkboxTaskFilter && !this.checkboxControlFilter) {
            this.taskFilter.isControl = 'false';
        }
        if (this.checkboxTaskFilter && !this.checkboxControlFilter) {
            this.taskFilter.isControl = false;
        }
        if (!this.checkboxTaskFilter && this.checkboxControlFilter) {
            this.taskFilter.isControl = true;
        }
    }

    processesBarClick(id) {
        this.taskFilter.processId = id;
    }

    changeResponsible(item, event) {
        let model = {
            type: TaskType.Performer,
            userId: event.value,
            taskId: item.taskId
        };
        console.log(model);
        this._taskService.updateAssignee(model)
            .then(response => {
                // this._translate.get(response).subscribe(value => this._alert.success(value));
                console.log(response);
            })
    }

    isRejected(status)
    {
        if(status == TaskStatus.Rejected)
            return true;
        else
            return false;
    }

    editTask(taskId):void{
        this._router.navigate(['gdpr', 'tasks', 'edit', taskId]);
    }

    openPerformDialog(taskId):void {
        let dialogRef = this._dialog.open(PerformDetailComponent, {
            panelClass: 'task-popup',
            data: {
                taskId: taskId,
                isReadOnly: true
            }
        });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result && result.reload) {
        //         this._taskService.getAllTask()
        //         .then(data => {
        //             this.listTasks = data;
        //         });
        //     }
        // });
    }

    openReviewDialog(taskId):void {
        let dialogRef = this._dialog.open(ReviewDetailComponent, {
            panelClass: 'task-popup',
            data: {
                taskId: taskId,
                isReadOnly: true
            }
        });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result && result.reload) {
        //         this._taskService.getAllTask()
        //         .then(data => {
        //             this.listTasks = data;
        //         });
        //     }
        // });
    }

    openDetailDialog(taskId):void {
        let dialogRef = this._dialog.open(ProcessesDetailComponent, {
            panelClass: 'task-popup',
            data: {
                taskId: taskId,
                isReadOnly: true
            }
        });
    }
}