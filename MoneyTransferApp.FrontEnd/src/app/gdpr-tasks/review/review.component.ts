import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { TaskService } from '../../shared/services/task.service';
import { TaskType, TaskStatus } from '../../shared/models/EnumType';
import { MatDialog } from '@angular/material';
import { ReviewDetailComponent } from './detail/detail.component';

@Component({
    templateUrl: './review.component.html',
    styleUrls: ['../tasks.component.css']
})

export class ReviewComponent implements OnInit {
    taskFilter:any = {taskTitle: '', isControl: null};
    checkboxTaskFilter = true;
    checkboxControlFilter = true;
    listTasks;

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
        private _taskService: TaskService,
        private _dialog: MatDialog
    ) {}
    
    ngOnInit() :void {
        this.getData();
    }

    getData() {
        this._taskService.getAllTaskBy(TaskType.Reviewer)
            .then(response => {
                this.listTasks = response;
                console.log(response);
            })
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

    filterTaskTime(task) {
        let today = Date.now();
        let startDay = new Date(task.startDate);
        let deadline = new Date(task.performerDeadline);

        let diff = Math.floor(deadline.valueOf() - today.valueOf())/(24*60*60*1000);

        if (today.valueOf() >= deadline.valueOf()) {
            if (today.valueOf() > deadline.valueOf()) {
                // Outdate
                return 0;
            } else {
                // Today
                return 1;
            }
        } else {
            if (diff <= 7) {
                // next7day
                return 7;
            };
            if (7 < diff && diff <= 30) {
                // 7to30day
                return 30;
            };
        }
        return false;
    }

    isPendingReview(status)
    {
        if(status == TaskStatus.PendingReview)
            return true;
        else
            return false;
    }

    openDialog(taskId):void {
        let dialogRef = this._dialog.open(ReviewDetailComponent, {
            panelClass: 'task-popup',
            data: {
                taskId: taskId
            }
        })
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.reload) {
                this.getData();
            }
        });
    }
}