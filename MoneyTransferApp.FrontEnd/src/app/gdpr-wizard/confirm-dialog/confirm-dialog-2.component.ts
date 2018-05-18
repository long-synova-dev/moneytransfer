import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: 'confirm-dialog-2.component.html',
})
export class StepCancelComponent2 {

    confirmValue:boolean = true;

    constructor(
        public dialogRef: MatDialogRef<StepCancelComponent2>,
        @Inject(MAT_DIALOG_DATA) public confirm: boolean) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}