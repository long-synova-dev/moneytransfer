import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { DataprocessorService } from '../../shared/services/dataprocessor.service';
import { MatDialog } from '@angular/material';
import { CopyDataProcessorDialog } from './copy-dataprocessor/copy-dataprocessor-dialog.component';
import { DeleteDataProcessorDialog } from './delete-dataprocessor/delete-dataprocessor-dialog.component';

@Component({
    templateUrl: './dataprocessor.component.html',
    styleUrls: ['../management.component.css']
})

export class DataprocessorComponent implements OnInit {
    listDataprocessor;

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _dataprocessor: DataprocessorService,
        private _router: Router,
        public copyDialog: MatDialog,
        public deleteDialog: MatDialog
    ) { }

    ngOnInit() {
        this._data.changeLoadStatus(true);

        this._dataprocessor.getAllDataprocessor()
            .then(response => {
                this.listDataprocessor = response;
                this._data.changeLoadStatus(false);
            });
    }

    viewDetail(dataprocessorId) {
        this._router.navigate(['/gdpr/management/dataprocessor-management', dataprocessorId])
    }

    makeCopy(item) {
        let dialogRef = this.copyDialog.open(CopyDataProcessorDialog, {
            width: '450px',
            data: {
                processorNewName: item.documentName
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._data.changeLoadStatus(true);

                this._dataprocessor.copyDataprocessor({ processorId: item.documentId, processorNewName: result })
                    .then(copiedItem => {
                        item.copies.push(copiedItem);
                        this._data.changeLoadStatus(false);
                    });
            }
        });
    }

    delete(item, subItem) {
        let dialogRef = this.deleteDialog.open(DeleteDataProcessorDialog, {
            width: '450px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._data.changeLoadStatus(true);

                this._dataprocessor.deleteDataprocessor(subItem.documentId)
                    .then(copiedItem => {
                        item.copies = item.copies.filter(c => c.documentId !== subItem.documentId);
                        this._data.changeLoadStatus(false);
                    });
            }
        });
    }
}