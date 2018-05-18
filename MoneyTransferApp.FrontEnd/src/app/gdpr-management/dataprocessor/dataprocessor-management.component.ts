import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../../shared/services/data.service';
import { Globals } from '../../shared/global/global';
import { AlertService } from '../../shared/services/alert.service';
import { DataprocessorService } from '../../shared/services/dataprocessor.service';
import { FileUploader } from 'ng2-file-upload';
import { AttachmentService } from '../../shared/services/attachment.service';
import { ModalDialog } from '../../shared/models/modal-dialog.model';
import { DocumentType } from '../../shared/models/EnumType';
import { HistoryService } from '../../shared/services/history.service';
import { ButtonModule } from '../button/button.module';
import { UserService } from '../../shared/services/user.service';
import { DateFormatPipe } from '../../shared/pipes/dateformat.pipes'
import { MatDialog } from '@angular/material';
import { SendCounterpartDialog } from './send-counterpart/send-counterpart.component';

@Component({
    templateUrl: './dataprocessor-management.component.html',
    styleUrls: ['../management.component.css']
})

export class DataprocessorManagementComponent implements OnInit {

    isOpenMaxStorageQuotaWarning: boolean = false;
    warningDialog: ModalDialog;
    remainingQuota: any;
    dataprocessorId;
    dataprocessorDetail;
    readyToLoad: boolean = false;
    templateHTML;
    originalDataInput = [];
    customDataInput = [];
    useExisting: boolean = false;
    counterpartStatus: boolean = false;
    dataProcessorhistory;
    isHasContent: boolean;
    isTrial: boolean;
    canAccessProFeature: boolean = false;

    public uploader: FileUploader;
    isUploaded: boolean;
    uploadedFile: any;
    fileName: string;

    deleteConfirm: ModalDialog;

    ExtraModule = [ButtonModule];

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _attachmentService: AttachmentService,
        private _alert: AlertService,
        private _dataprocessor: DataprocessorService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _historyService: HistoryService,
        private _userService: UserService,
        public sendCounterpartDialog: MatDialog,
    ) {
        this.deleteConfirm = new ModalDialog("Confirm Delete", "modal-md", false);
        this.warningDialog = new ModalDialog("Please upgrade your plan", "modal-md", false);
    }
    private _getDataProcessor(onload) {
        this._data.changeLoadStatus(true);
        this._dataprocessor.getDataprocessorById(this.dataprocessorId)
            .then(response => {
                console.log(response);
                this.dataprocessorDetail = response;
                this.useExisting = response.useExisting;
                this.originalDataInput = response.keyValues;
                this.templateHTML = this.convertHTML(response.dataProcessorTemplate, response.keyValues);
                this.readyToLoad = true;
                this._data.changeLoadStatus(false);
                if (onload) {
                    this._dataprocessor.updateCounterpartStatus(response.isCounterpartOk);
                }

                this._attachmentService.getRemainingQuota().then(quota => {
                    this.remainingQuota = quota;
                    this._data.changeLoadStatus(false);
                });
            })
        let model = {
            type: DocumentType.Processor,
            referId: this.dataprocessorId
        };
        this._historyService.getHistory(model).then(data => {
            this.dataProcessorhistory = data;
            this.dataProcessorhistory.forEach(element => {
                let avName = "";
                if (element.owner) {
                    avName += element.owner.charAt(0);
                }
                if (element.lastName) {
                    avName += element.lastName.charAt(0);
                }
                element.avatarName = avName;
            });
        });
    }

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            if (params && params.id) {
                this.dataprocessorId = params.id;
                this._getDataProcessor(true);
            }

            this._attachmentService.isHascontent(params.id, DocumentType.Processor).then(response => {
                this.isHasContent = response;
            })

            this._userService.GetUserStatus()
                .then(s => {
                    this.canAccessProFeature = (s.status == 3 || s.status == 8);
                })
        });
        this._dataprocessor.getCounterpartStatus.subscribe(status => {
            this.counterpartStatus = status;
            if (this.counterpartStatus) {
                this._getDataProcessor(false);
            }
        });

        this._attachmentService.getUploadedFile(Globals.DATAPROCESSOR_FILE, this.dataprocessorId)
            .then(response => {
                if (response && response.fileName != null) {
                    this.isUploaded = true;
                    this.uploadedFile = response;
                    this.fileName = response.fileName;
                }
            })

        this.uploader = new FileUploader({
            url: Globals.UPLOAD_FILE_URL,
            authToken: `Bearer ${localStorage.getItem('accessToken')}`,
            isHTML5: true,
            maxFileSize: Globals.MAX_FILE_SIZE_TO_UPLOAD
        });

        this.uploader.onAfterAddingFile = f => {
            if (this.uploader.queue.length > 1) {
                this.uploader.removeFromQueue(this.uploader.queue[0]);
            }

            if (this.uploader.queue[0].file.size >= this.remainingQuota) {
                this.isOpenMaxStorageQuotaWarning = true;
                this.warningDialog.visible = true;
                this.uploader.removeFromQueue(this.uploader.queue[0]);
            }
        };

        this.uploader.onWhenAddingFileFailed = (item, filter) => {
            if (filter.name == 'fileSize') {
                this._translate.get('General.FileTooBig').subscribe(value => this._alert.error(value));
            }
        };

        this.uploader.onBuildItemForm = (item, form) => {
            form.append("fileType", Globals.DATAPROCESSOR_FILE);
            form.append("refId", this.dataprocessorId);
        };

        this.uploader.onProgressItem = () => {
            this._data.changeLoadStatus(true);
        }

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this._translate.get('Dataprocess.UploadSuccessfully').subscribe(value => this._alert.success(value));
            this._attachmentService.getUploadedFile(Globals.DATAPROCESSOR_FILE, this.dataprocessorId)
                .then(response => {
                    if (response && response.fileName != null) {
                        this.isUploaded = true;
                        this.uploadedFile = response;
                        this.fileName = response.fileName;
                        this._data.changeLoadStatus(false);
                    }
                })
        };
        let userPlan = !localStorage.getItem('plan') ? null : localStorage.getItem('plan').split(',');
        if (userPlan.filter(x => x == "trial").length > 0) {
            this.isTrial = true;
        }
    };

    clickLock() {
        if (this.canAccessProFeature) {
            this.dataprocessorDetail.isLocked = !this.dataprocessorDetail.isLocked;
            if (!this.dataprocessorDetail.isLocked && this.dataprocessorDetail.lastSentToCounterpart) {
                this._translate.get('Dataprocess.UnlockAfterSendCounterpart').subscribe(value => this._alert.success(value));                
            }
        }
        else {
            this.isOpenMaxStorageQuotaWarning = false;
            this.warningDialog.visible = true;
        }
    }

    useExistingChange() {
        this.dataprocessorDetail.useExisting = this.useExisting;
    }
    counterpartClick() {
        this._dataprocessor.setSharedDataId(this.dataprocessorDetail.dataProcessorId);
        this._router.navigate(['counterpart'], { relativeTo: this._activatedRoute });
    }
    save(isDownload) {
        this._data.changeLoadStatus(true);
        let p = new Promise<boolean>((resolve, reject) => {
            this.customDataInput = this._data.getShareContentEditor();
            this.customDataInput.forEach(item => {
                let checkField = this.originalDataInput.find(e => e.key == item.key);
                if (checkField) {
                    checkField['value'] = item.value;
                } else {
                    this.originalDataInput.push(item);
                }
            });
            if (this.originalDataInput == null && this.dataprocessorDetail.useExisting) {
                this._alert.error('Update content before save');
                this._data.changeLoadStatus(false);
                reject(false);
            };
            this.dataprocessorDetail['keyValues'] = this.originalDataInput;
            this._dataprocessor.updateDataprocessor(this.dataprocessorDetail)
                .then(response => {
                    if (!isDownload) {
                        this._router.navigate(['gdpr', 'management', 'dataprocessor']);
                        this._data.changeLoadStatus(false);
                    }
                    resolve(true);
                });
        });

        return p;
    }

    convertHTML(template, keys) {
        const patternTextBox = /\[\[(.*?)\]\]/g;
        const patternTextArea = /\#\#(.*?)\#\#/g;
        const patternUnfilledData = /\*\*(.*?)\*\*/g;
        const patternPrefilled = /\@\@(.*?)\@\@/g;

        let keyValue;
        let newTemplate = `${template}`;

        while ((keyValue = patternTextBox.exec(template)) !== null) {
            let defaults = keyValue[1].split(":");
            let item = keys.find(x => x.key == defaults[0]);
            if (keyValue.index === patternTextBox.lastIndex) {
                patternTextBox.lastIndex++;
            }
            newTemplate = newTemplate.replace(keyValue[0], `<my-input inputName="${defaults[0]}" inputValue="${item ? item.value : (defaults[1] ? defaults[1] : '')}"></my-input>`);
        };

        while ((keyValue = patternTextArea.exec(template)) !== null) {
            let defaults = keyValue[1].split(":");
            let item = keys.find(x => x.key == defaults[0]);
            if (keyValue.index === patternTextArea.lastIndex) {
                patternTextArea.lastIndex++;
            }

            newTemplate = newTemplate.replace(keyValue[0], `<my-textarea inputName="${defaults[0]}" inputValue="${item ? item.value : (defaults[1] ? defaults[1] : '')}"></my-textarea>`);
        };

        while ((keyValue = patternUnfilledData.exec(template)) !== null) {
            if (keyValue.index === patternTextArea.lastIndex) {
                patternTextArea.lastIndex++;
            }
            newTemplate = newTemplate.replace(keyValue[0], `<span class="unfilled-data">&nbsp;</span>`);
        };

        while ((keyValue = patternPrefilled.exec(template)) !== null) {
            if (keyValue.index === patternTextArea.lastIndex) {
                patternTextArea.lastIndex++;
            }
            newTemplate = newTemplate.replace(keyValue[0], `<span class="prefill-data">${keyValue[1]}</span>`);
        };
        return newTemplate;
    }

    download() {
        this._data.changeLoadStatus(true);
        this._attachmentService.downloadFile(this.uploadedFile.fileId)
            .then(blob => {
                {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = this.fileName;
                    link.click();
                    this._data.changeLoadStatus(false);
                }
            })
    }

    confirmDelete() {
        this.deleteConfirm.visible = true;
    }

    closeDelete() {
        this.deleteConfirm.visible = false;
    }

    delete() {
        this._data.changeLoadStatus(true);
        this._attachmentService.deleteFile(this.uploadedFile.fileId)
            .then(response => {
                if (response) {
                    this.deleteConfirm.visible = false;
                    this.isUploaded = false;
                    this.uploadedFile = null;
                    this.fileName = "";

                    this._attachmentService.getRemainingQuota().then(quota => {
                        this.remainingQuota = quota;
                        this._data.changeLoadStatus(false);
                    });
                }
            })
    }
    downloadPDF() {
        this._data.changeLoadStatus(true);
        if (!this.canAccessProFeature) {
            this.isOpenMaxStorageQuotaWarning = false;
            this.warningDialog.visible = true;
            this._data.changeLoadStatus(false);
        } else {
            this.save(true).then((result) => {
                if (result) {
                    this._attachmentService.downloadAsPdf(this.dataprocessorDetail.dataProcessorId, DocumentType.Processor)
                        .then(blob => {
                            {
                                var link = document.createElement('a');
                                document.body.appendChild(link);
                                link.href = window.URL.createObjectURL(blob);
                                link.download = "dataprocessor.pdf";
                                link.click();
                                this._data.changeLoadStatus(false);
                            }
                        });
                }
            });
        }
    }

    goToSubscription() {
        window.location.href = '/billing-plan';
    }

    sendToCounterpart() {
        if (!this.canAccessProFeature) {
            this.isOpenMaxStorageQuotaWarning = false;
            this.warningDialog.visible = true;
            return;
        }

        if (!this.dataprocessorDetail.counterpartEmail) {
            this._translate.get('Dataprocess.NoCounterpartEmail').subscribe(value => this._alert.error(value));
            return;
        }

        if (!this.dataprocessorDetail.isLocked) {
            this._translate.get('Dataprocess.MustBeLocked').subscribe(value => this._alert.error(value));
            return;
        }

        let dialogRef = this.sendCounterpartDialog.open(SendCounterpartDialog, {
            width: '650px',
            data: {
                counterpartEmail: this.dataprocessorDetail.counterpartEmail
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._data.changeLoadStatus(true);
                this._dataprocessor.senDataprocessor(this.dataprocessorDetail.dataProcessorId)
                    .then(() => {
                        this._translate.get('Dataprocess.SentSucessfully').subscribe(value => this._alert.success(value));
                        this.dataprocessorDetail.lastSentToCounterpart = new Date();
                        this._data.changeLoadStatus(false);
                    });
            }
        });
    }
}