import { CommonModule } from '@angular/common';
import { DateFormatPipe } from './shared/pipes/dateformat.pipes';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [ DateFormatPipe],
    exports: [ 
     CommonModule,   
     DateFormatPipe
    ]
  })
  export class SharedModule {}