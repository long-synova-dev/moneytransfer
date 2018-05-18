import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Inject, Component } from "@angular/core";
import { OnInit } from "@angular/core";

@Component({
  templateUrl: 'copy-dataprocessor-dialog.component.html',
})
export class CopyDataProcessorDialog implements OnInit {

  processorNewName;

  constructor(
    public dialogRef: MatDialogRef<CopyDataProcessorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.processorNewName = this.data.processorNewName;
  }

  save() {
    if (this.processorNewName) {
      this.dialogRef.close(this.processorNewName);
    }
  }
}