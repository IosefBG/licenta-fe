import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardUserRoutingModule } from './board-user-routing.module';
import { BoardUserComponent } from './board-user.component';
import {FormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {TimesheetModalModule} from "../modals/timesheet-modal/timesheet-modal.module";


@NgModule({
  declarations: [
    BoardUserComponent
  ],
  imports: [
    CommonModule,
    BoardUserRoutingModule,
    // BrowserAnimationsModule,
    TimesheetModalModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule
  ]
})
export class BoardUserModule { }
