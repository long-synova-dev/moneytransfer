import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../../shared/global/global';

import { TaskType, TaskStatus, DocumentType } from '../../../shared/models/EnumType';
import { DataService } from '../../../shared/services/data.service';
import { TaskService } from '../../../shared/services/task.service';
import { HistoryService } from '../../../shared/services/history.service';
import { FileUploader } from 'ng2-file-upload';
import { AlertService } from '../../../shared/services/alert.service';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { AttachmentService } from '../../../shared/services/attachment.service';
import { ModalDialog } from '../../../shared/models/modal-dialog.model';
import { DateFormatPipe} from '../../../shared/pipes/dateformat.pipes'

@Component({
    templateUrl: './detail.component.html',
    styleUrls: ['../../tasks.component.css']
})

export class PerformDetailComponent implements OnInit {
    remainingQuota: any;
    warningDialog: ModalDialog;

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
        public _dialogRef: MatDialogRef<PerformDetailComponent>,
        private _fileUploadService: FileUploadService,
        private _alert: AlertService,
        private _attachmentService: AttachmentService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.warningDialog = new ModalDialog("Error", "modal-md", false);
    }

    ngOnInit() {
        //  this._data.changeLoadStatus(true);
        this.isReadOnly = this.data.isReadOnly;
        this._taskService.getTaskDetail(this.data.taskId)
            .then(response => {
                this.taskDetail = response;
                this.addUploaderToTodo(this.taskDetail.todos);
                this.readyToLoad = true;
                var item = this.taskDetail.todos.filter(s => !s.isPerformed)[0];
                if (item) {
                    this.disabled = true;
                }
                this.isDone = this.taskDetail.taskStatus == TaskStatus.Done;

                this._attachmentService.getRemainingQuota().then(quota => {
                    this.remainingQuota = quota;
                    this._data.changeLoadStatus(false);
                });
            });
        let model = {
            type: DocumentType.Task,
            referId: this.data.taskId
        };
        this._historyService.getHistory(model)
            .then(history => {
                this.listHistory = history;
            });
    }

    addUploaderToTodo(todos) {
        todos.forEach(todo => {
            if (todo.requireDocumentation) {
                this._fileUploadService.getUploadedFile(Globals.TODO_FILE, todo.todoId)
                    .then(response => {
                        if (response && response.fileName != null) {
                            todo.uploadedFile = response;
                        } else {
                            this._createUploader(todo);
                        }
                    });
            }
        });
    }

    checkTodo($event, todo) {
        if (todo.requireDocumentation && !todo.uploadedFile) {
            this._translate.get('Perform.UploadRequired').subscribe(value => this._alert.error(value));
            todo.isPerformed = false;
            $event.preventDefault();
        } else {
            todo.isPerformed = !todo.isPerformed;
            var item = this.taskDetail.todos.filter(s => !s.isPerformed)[0];
            this.disabled = item ? true : false;
        }
    }

    clickSave() {
        this._data.changeLoadStatus(true);
        let data = { reload: true };
        this._taskService.updateTaskDetail(this.taskDetail)
            .then(response => {
                this._dialogRef.close(data);
                this._data.changeLoadStatus(false);
            });
    }
    clickDone() {
        this._data.changeLoadStatus(true);
        let data = { reload: true };
        this.taskDetail.taskStatus = this.taskDetail.enableTaskReview ? TaskStatus.PendingReview : TaskStatus.Done;
        this._taskService.updateTaskDetail(this.taskDetail)
            .then(response => {
                this._dialogRef.close(data);
                this._data.changeLoadStatus(false);
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

    delete(todo) {
        this._data.changeLoadStatus(true);
        this._attachmentService.deleteFile(todo.uploadedFile.fileId)
            .then(response => {
                if (response) {
                    this._translate.get('Perform.DeleteSuccessfully').subscribe(value => this._alert.success(value));
                    todo.isPerformed = false;
                    todo.uploadedFile = undefined;
                    this._createUploader(todo);

                    this._attachmentService.getRemainingQuota().then(quota => {
                        this.remainingQuota = quota;
                        this._data.changeLoadStatus(false);
                    });
                }
            })
    }

    private _createUploader(todo) {
        let uploader = new FileUploader({
            url: Globals.UPLOAD_FILE_URL,
            authToken: `Bearer ${localStorage.getItem('accessToken')}`,
            isHTML5: true,
            maxFileSize: Globals.MAX_FILE_SIZE_TO_UPLOAD
        });

        uploader.onAfterAddingFile = f => {
            if (uploader.queue.length > 1) {
                uploader.removeFromQueue(uploader.queue[0]);
            }

            if (uploader.queue[0].file.size >= this.remainingQuota) {
                this.warningDialog.visible = true;
                uploader.removeFromQueue(uploader.queue[0]);
            }
        };

        uploader.onWhenAddingFileFailed = (item, filter) => {
            if (filter.name == 'fileSize') {
                this._translate.get('General.FileTooBig').subscribe(value => this._alert.error(value));
            }
        };

        uploader.onBuildItemForm = (item, form) => {
            form.append("fileType", Globals.TODO_FILE);
            form.append("refId", todo.todoId);
        };

        uploader.onProgressItem = () => {
            this._data.changeLoadStatus(true);
        }

        uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this._translate.get('Perform.UploadSuccessfully').subscribe(value => this._alert.success(value));
            this._data.changeLoadStatus(false);

            this._fileUploadService.getUploadedFile(Globals.TODO_FILE, todo.todoId)
                .then(response => {
                    if (response && response.fileName != null) {
                        todo.uploadedFile = response;
                    }
                })
        };

        todo.uploader = uploader;
    }

    goToSubscription() {
        window.location.href = '/billing-plan';
    }
}