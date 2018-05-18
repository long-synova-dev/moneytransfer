import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { slideInOutTransition } from '../../../../animations/slide-transition';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../../../shared/services/data.service';
import { PersonDataService } from '../../../../shared/services/persondata.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { IOption } from 'ng-select';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { AttachmentService } from '../../../../shared/services/attachment.service';
import { Globals } from '../../../../shared/global/global';
import { ModalDialog } from '../../../../shared/models/modal-dialog.model';

@Component({
    templateUrl: './3rd-party-ex.component.html',
    styleUrls: ['../../../management.component.css'],
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class ThirdPartyExComponent implements OnInit {

    vendorData;

    listSuggestions: Array<IOption> = [];
    listSuggestionsOriginal: Array<IOption> = [];

    remainingQuota: number;
    public uploader: FileUploader;
    isUploaded: boolean;
    uploadedFile: any;
    fileName: string;
    isOpenMaxStorageQuotaWarning:boolean = false;
    deleteConfirm: ModalDialog;

    constructor(
        private _translate: TranslateService,
        public _data: DataService,
        private _router: Router,
        private _alert: AlertService,
        private _fileUploadService: AttachmentService,
        private _persondataService: PersonDataService) 
        {
            this.deleteConfirm = new ModalDialog("Confirm Delete", "modal-md", false);
        }

    ngOnInit() {
        this.vendorData = this._persondataService.getSharedVendorData();
        if (!this.vendorData) {
            this._router.navigate(['gdpr', 'management', 'persondata', '3rd-party-country-transfer']);
        } else {
            this.upLoad();
        }
    }

    upLoad() {
        this._persondataService.getVendorSalesGroup()
            .then(data => {
                let listSalesGroup:Array<IOption> = [];
                data.forEach(element => {
                    if (element) {
                        let category = {
                            value: element,
                            label: element
                        }
                        listSalesGroup.push(category);
                    }
                });
                console.log(listSalesGroup);
                this.listSuggestionsOriginal = listSalesGroup;
                this.listSuggestions = listSalesGroup;
            })

        this._fileUploadService.getUploadedFile(Globals.VENDOR_FILE, this.vendorData.vendorId)
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
                // this.warningDialog.visible = true;
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
            form.append("fileType", Globals.VENDOR_FILE);
            //refference to policy table
            form.append("refId", this.vendorData.vendorId);
        };

        this.uploader.onProgressItem = () => {
            this._data.changeLoadStatus(true);
        }

        this.uploader.onCompleteItem = (item: FileItem, response: any, status: any, headers: any) => {
            this.remainingQuota -= item.file.size;
            this._translate.get('Persondata.UploadSuccessfully').subscribe(value => this._alert.success(value));
            this._fileUploadService.getUploadedFile(Globals.VENDOR_FILE, this.vendorData.vendorId)
                .then(response => {
                    if (response && response.fileName != null) {
                        this.isUploaded = true;
                        this.uploadedFile = response;
                        this.fileName = response.fileName;
                        this._data.changeLoadStatus(false);
                    }
                })
        };
    }

    onNoOptionsFound(searchTerm) {
        this.listSuggestions = [{ label: searchTerm, value: searchTerm }, ...this.listSuggestionsOriginal];
        this.vendorData['salesGroup'] = searchTerm;
    }

    saveVendor() {
        this._persondataService.updateVendor(this.vendorData)
            .then(response => {
                if (response && response.error) {
                    this._translate.get(response.error).subscribe(data => this._alert.error(data));
                } else {
                    this._alert.success('Susscess');
                    this._persondataService.changeShareVendorData(this.vendorData);
                    this._router.navigate(['gdpr', 'management', 'persondata', '3rd-party-country-transfer']);
                }
            })
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
                    this._translate.get('Persondata.DeleteSuccessfully').subscribe(value => this._alert.success(value));
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
}