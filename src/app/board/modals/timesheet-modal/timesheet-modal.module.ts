import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetModalComponent } from './timesheet-modal.component';
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";



@NgModule({
  declarations: [
    TimesheetModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule
  ],
  exports : [TimesheetModalComponent]
})
export class TimesheetModalModule { }
