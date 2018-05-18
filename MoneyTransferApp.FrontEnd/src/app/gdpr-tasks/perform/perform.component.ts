import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { TaskService } from '../../shared/services/task.service';
import { TaskType, TaskStatus } from '../../shared/models/EnumType';
import { MatDialog } from '@angular/material';
import { PerformDetailComponent } from './detail/detail.component';

@Component({
    templateUrl: './perform.component.html',
    styleUrls: ['../tasks.component.css']
})

export class PerformComponent implements OnInit {
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
    
    ngOnInit(): void{
        this.getData();
    }

    getData() {
        this._taskService.getAllTaskBy(TaskType.Performer).then(response=>
            {
                this.listTasks = response;
                console.log('perfomer list task', this.listTasks);
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
    }

    isPerform(task)
    {
        let status = task.taskStatus;
        if(!task.isRecurring && (status == TaskStatus.Scheduled || status == TaskStatus.InProgress || status == TaskStatus.Rejected))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    isRejected(status)
    {
        if(status == TaskStatus.Rejected)
            return true;
        else
            return false;
    }
    
    openDialog(taskId):void {
        let dialogRef = this._dialog.open(PerformDetailComponent, {
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