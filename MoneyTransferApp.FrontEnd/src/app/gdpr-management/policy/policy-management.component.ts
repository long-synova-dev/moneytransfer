import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../../shared/services/data.service';
import { PolicyService } from '../../shared/services/policy.service';
import { Globals } from '../../shared/global/global';
import { AlertService } from '../../shared/services/alert.service';
import { AttachmentService } from "../../shared/services/attachment.service";
import { FileUploader, FileItem } from 'ng2-file-upload';
import { CommonService } from '../../shared/services/common.service';
import { ModalDialog } from '../../shared/models/modal-dialog.model';
import { HistoryService } from '../../shared/services/history.service';
import { DocumentType } from '../../shared/models/EnumType';
import { ButtonModule } from '../button/button.module';
import { UserService } from '../../shared/services/user.service';

@Component({
    templateUrl: './policy-management.component.html',
    styleUrls: ['../management.component.css']
})

export class PolicyManagementComponent implements OnInit {
    policyId;
    policyDetail;
    readyToLoad: boolean = false;
    templateHTML;
    originalPolicyInput = [];
    customPolicyInput = [];
    useExisting: boolean = false;
    policyHistory;
    isHasContent: boolean;
    isTrial: boolean;
    canAccessProFeature: boolean = false;
    remainingQuota: number;

    public uploader: FileUploader;
    isUploaded: boolean;
    uploadedFile: any;
    fileName: string;

    isOpenMaxStorageQuotaWarning:boolean = false;

    deleteConfirm: ModalDialog;
    warningDialog: ModalDialog;

    ExtraModule = [ButtonModule];

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _activatedRoute: ActivatedRoute,
        private _fileUploadService: AttachmentService,
        private _policy: PolicyService,
        private _alert: AlertService,
        private _router: Router,
        private _historyService: HistoryService,
        private _userService: UserService
    ) {
        this.deleteConfirm = new ModalDialog("Confirm Delete", "modal-md", false);
        this.warningDialog = new ModalDialog("Error",  "modal-md", false);
    }

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            if (params && params.id) {
                this.policyId = params.id;
                this._data.changeLoadStatus(true);
                this._policy.getPolicyById(params.id)
                    .then(response => {
                        this.policyDetail = response;
                        this.useExisting = response.useExisting;
                        this.originalPolicyInput = response.keyValues;
                        this.templateHTML = this.convertHTML(response.policyTemplate, response.keyValues);
                        this.readyToLoad = true;

                        this._fileUploadService.getRemainingQuota().then(quota => {
                            this.remainingQuota = quota;
                            this._data.changeLoadStatus(false);
                        });
                    });
                let model = {
                    type: DocumentType.Policy,
                    referId: params.id
                };
                this._historyService.getHistory(model).then(data => {
                    this.policyHistory = data;
                    this.policyHistory.forEach(element => {
                        let avName = "";
                        if(element.owner){
                            avName += element.owner.charAt(0);
                        }
                        if(element.lastName)
                        {
                            avName+= element.lastName.charAt(0);
                        }
                        element.avatarName = avName;
                    });
                });
                this._fileUploadService.isHascontent(params.id, DocumentType.Policy).then(response => {
                    this.isHasContent = response;
                });
                this._userService.GetUserStatus()
                    .then(s => {
                        this.canAccessProFeature = (s.status == 3 || s.status == 8);
                    });
            }
        });

        this._fileUploadService.getUploadedFile(Globals.POLICY_FILE, this.policyId)
            .then(response => {
                if (response && response.fileName != null) {
                    this.isUploaded = true;
                    this.uploadedFile = response;
                    this.fileName = response.fileName;
                }
            });

        this.uploader = new FileUploader({
            url: Globals.UPLOAD_FILE_URL,
            authToken: `Bearer ${localStorage.getItem('accessToken')}`,
            isHTML5: true,
            maxFileSize: Globals.MAX_FILE_SIZE_TO_UPLOAD,
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

            //file for Policy
            form.append("fileType", Globals.POLICY_FILE);
            //refference to policy table
            form.append("refId", this.policyId);
        };

        this.uploader.onProgressItem = () => {
            this._data.changeLoadStatus(true);
        }

        this.uploader.onCompleteItem = (item: FileItem, response: any, status: any, headers: any) => {
            this.remainingQuota -= item.file.size;
            this._translate.get('Policy.UploadSuccessfully').subscribe(value => this._alert.success(value));
            this._fileUploadService.getUploadedFile(Globals.POLICY_FILE, this.policyId)
                .then(response => {
                    if (response && response.fileName != null) {
                        this.isUploaded = true;
                        this.uploadedFile = response;
                        this.fileName = response.fileName;
                        this._data.changeLoadStatus(false);
                    }
                })
        };

        let userPlan = localStorage.getItem('plan') ? localStorage.getItem('plan').split(',') : null;
        if (userPlan && userPlan.filter(x => x == "trial").length > 0) {
            this.isTrial = true;
        }
    }

    clickLock() {
        if (this.canAccessProFeature) {
            this.policyDetail.isLocked = !this.policyDetail.isLocked;
        }
        else
        {
            this.isOpenMaxStorageQuotaWarning = false;
            this.warningDialog.visible = true;
        }
    }
    useExistingChange() {
        this.policyDetail.useExisting = this.useExisting;
    }

    convertHTML(template, keys) {
        const patternTextBox = /\[\[(.*?)\]\]/g;
        const patternTextArea = /\#\#(.*?)\#\#/g;
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

        while ((keyValue = patternPrefilled.exec(template)) !== null) {
            if (keyValue.index === patternTextArea.lastIndex) {
                patternTextArea.lastIndex++;
            }
            newTemplate = newTemplate.replace(keyValue[0], `<span class="prefill-data">${keyValue[1]}</span>`);
        };
        return newTemplate;
    }

    save(isDownload) {
        this._data.changeLoadStatus(true);

        let p = new Promise<boolean>((resolve, reject) => {
            this.customPolicyInput = this._data.getShareContentEditor();
            this.customPolicyInput.forEach(item => {
                let checkField = this.originalPolicyInput.find(e => e.key == item.key);
                if (checkField) {
                    checkField['value'] = item.value;
                } else {
                    this.originalPolicyInput.push(item);
                }
            });
            if (this.originalPolicyInput == null && this.policyDetail.useExisting) {
                this._alert.error('Update content before save');
                this._data.changeLoadStatus(false);
                reject(false);
            };
            this.policyDetail['keyValues'] = this.originalPolicyInput;
            this._policy.updatePolicy(this.policyDetail)
                .then(response => {
                    if (!isDownload) {

                        this._router.navigate(['gdpr', 'management', 'policy']);
                        this._data.changeLoadStatus(false);
                    }
                    resolve(true);
                });
        });

        return p;
    }

    download() {
        this._data.changeLoadStatus(true);
        this._fileUploadService.downloadFile(this.uploadedFile.fileId)
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

    delete() {
        this._data.changeLoadStatus(true);
        this.deleteConfirm.visible = false;
        this._fileUploadService.deleteFile(this.uploadedFile.fileId)
            .then(response => {
                if (response) {
                    this.isUploaded = false;
                    this.uploadedFile = null;
                    this.fileName = "";
                    this._translate.get('Policy.DeleteSuccessfully').subscribe(value => this._alert.success(value));
                    this._fileUploadService.getRemainingQuota().then(quota => {
                        this.remainingQuota = quota;
                        this._data.changeLoadStatus(false);
                    });
                }
            })
    }

    confirmDelete() {
        this.deleteConfirm.visible = true;
    }

    closeDelete() {
        this.deleteConfirm.visible = false;
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
                    this._fileUploadService.downloadAsPdf(this.policyDetail.policyId, DocumentType.Policy)
                        .then(blob => {
                            {
                                var link = document.createElement('a');
                                document.body.appendChild(link);
                                link.href = window.URL.createObjectURL(blob);
                                link.download = "policy.pdf";
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
}