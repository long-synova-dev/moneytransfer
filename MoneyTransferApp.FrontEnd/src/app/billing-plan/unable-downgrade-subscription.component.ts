import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: 'unable-downgrade-subscription.component.html',
})
export class UnableDowngradeSubscriptionComponent {

    confirmValue:boolean = true;

    constructor(
        public dialogRef: MatDialogRef<UnableDowngradeSubscriptionComponent>,
        @Inject(MAT_DIALOG_DATA) public confirm: boolean) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}