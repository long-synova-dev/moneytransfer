import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: 'cancel-subscription.component.html',
})
export class CancelSubscriptionComponent {

    confirmValue:boolean = true;

    constructor(
        public dialogRef: MatDialogRef<CancelSubscriptionComponent>,
        @Inject(MAT_DIALOG_DATA) public confirm: boolean) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}