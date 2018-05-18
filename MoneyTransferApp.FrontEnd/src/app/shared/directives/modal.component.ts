import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ModalDialog } from '../models/modal-dialog.model';

@Component({
  selector: 'modal-dialog',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.95, .95, .95)' }),
        animate(150)
      ]),
      transition('* => void', [
        animate(50, style({ transform: 'scale3d(.95, .95, .95)' }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {
  @Input() modalDialog: ModalDialog;
  @Input() data: any;

  @Output() modalDialogChange: EventEmitter<ModalDialog> = new EventEmitter<ModalDialog>();
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  close() {
    if (!this.modalDialog.isModal) {
      this.modalDialog.visible = false;
      this.modalDialogChange.emit(this.modalDialog);
      this.dataChange.emit(this.data);
    }
  }
}