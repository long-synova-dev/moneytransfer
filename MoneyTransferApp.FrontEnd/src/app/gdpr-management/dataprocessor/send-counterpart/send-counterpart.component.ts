import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Inject, Component } from "@angular/core";
import { OnInit } from "@angular/core";

@Component({
  templateUrl: 'send-counterpart.component.html',
})
export class SendCounterpartDialog implements OnInit {

  counterpartEmail;

  constructor(
    public dialogRef: MatDialogRef<SendCounterpartDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.counterpartEmail = this.data.counterpartEmail;
  }
}