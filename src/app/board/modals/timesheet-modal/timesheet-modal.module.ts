import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetModalComponent } from './timesheet-modal.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    TimesheetModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports : [TimesheetModalComponent]
})
export class TimesheetModalModule { }
