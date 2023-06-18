import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardAdminRoutingModule } from './board-admin-routing.module';
import { BoardAdminComponent } from './board-admin.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {DataTableModule} from "../../shared/data-table/data-table.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";


@NgModule({
  declarations: [
    BoardAdminComponent
  ],
    imports: [
        CommonModule,
        BoardAdminRoutingModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatSelectModule,
        MatTableModule,
        DataTableModule,
        MatButtonModule,
        MatDatepickerModule
    ]
})
export class BoardAdminModule { }
