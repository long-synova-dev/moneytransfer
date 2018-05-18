import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../../shared/global/global';

import { TaskType, TaskStatus, DocumentType } from '../../../shared/models/EnumType';
import { DataService } from '../../../shared/services/data.service';
import { TaskService } from '../../../shared/services/task.service';
import { HistoryService } from '../../../shared/services/history.service';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { AttachmentService } from '../../../shared/services/attachment.service';
import { DateFormatPipe} from '../../../shared/pipes/dateformat.pipes'

@Component({
    templateUrl: './detail.component.html',
    styleUrls: ['../../tasks.component.css']
})

export class ReviewDetailComponent implements OnInit {


    taskDetail;
    readyToLoad: boolean = false;
    isReadOnly: boolean = false;
    listHistory: any = [];
    disabled = false;
    isDone = false;

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _taskService: TaskService,
        private _historyService: HistoryService,
        public _dialogRef: MatDialogRef<ReviewDetailComponent>,
        private _fileUploadService: FileUploadService,
        private _attachmentService: AttachmentService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
       // this._data.changeLoadStatus(true);
        this.isReadOnly = this.data.isReadOnly;
        this._taskService.getTaskDetail(this.data.taskId)
            .then(response => {
                this.taskDetail = response;
                this.getUploadedFiles(response.todos);
                this.readyToLoad = true;
                console.log(response);
                this.isDone = this.taskDetail.taskStatus == TaskStatus.Done;
               // this._data.changeLoadStatus(false);

            });
        let model = {
            type: DocumentType.Task,
            referId: this.data.taskId
        }
        this._historyService.getHistory(model)
            .then(history => {
                this.listHistory = history;
            });
    }

    approveClick(task) {
        task.isApprove = !task.isApprove
        if (task.isApprove) {
            task.isReject = false;
        }
    }
    rejectClick(task) {
        task.isReject = !task.isReject
        if (task.isReject) {
            task.isApprove = false;
        }
    }

    checkTodo(todoId) {
        let checkedTodo = this.taskDetail.todos.find(item => item.todoId == todoId);
        checkedTodo.isComplete = !checkedTodo.isComplete;
    }

    clickSave() {
        this._data.changeLoadStatus(true);

        let data = { reload: true };
        this._taskService.updateTaskDetail(this.taskDetail)
            .then(response => {
                this._dialogRef.close(data);
                this._data.changeLoadStatus(false);
            })
    }
    clickDone() {
        this._data.changeLoadStatus(true);

        let data = { reload: true };
        var todos = this.taskDetail.todos;
        var item = todos.filter(s => s.isReject)[0];
        this.taskDetail.taskStatus = item ? TaskStatus.Rejected : TaskStatus.Done;

        this._taskService.updateTaskDetail(this.taskDetail)
            .then(response => {
                this._dialogRef.close(data);
                this._data.changeLoadStatus(false);
            })
    }

    getUploadedFiles(todos) {
        todos.forEach(todo => {
            if (todo.requireDocumentation) {
                this._fileUploadService.getUploadedFile(Globals.TODO_FILE, todo.todoId)
                    .then(response => {
                        if (response && response.fileName != null) {
                            todo.uploadedFile = response;
                        }
                    });
            }
        });
    }

    download(uploadedFile) {
        this._data.changeLoadStatus(true);
        this._attachmentService.downloadFile(uploadedFile.fileId)
            .then(blob => {
                {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = uploadedFile.fileName;
                    link.click();
                    this._data.changeLoadStatus(false);
                }
            });
    }
}