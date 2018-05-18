import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: 'confirm-dialog.component.html',
})
export class StepCancelComponent {

    confirmValue:boolean = true;

    constructor(
        public dialogRef: MatDialogRef<StepCancelComponent>,
        @Inject(MAT_DIALOG_DATA) public confirm: boolean) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}