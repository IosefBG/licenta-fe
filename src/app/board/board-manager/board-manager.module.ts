import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardManagerRoutingModule } from './board-manager-routing.module';
import { BoardManagerComponent } from './board-manager.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {DataTableModule} from "../../shared/data-table/data-table.module";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    BoardManagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BoardManagerRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    DataTableModule,
    MatPaginatorModule,
    // BrowserAnimationsModule,
  ]
})
export class BoardManagerModule { }
