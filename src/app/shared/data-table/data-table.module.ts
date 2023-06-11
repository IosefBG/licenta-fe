import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataTableComponent} from "./data-table.component";
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
  ],
  exports: [DataTableComponent]
})
export class DataTableModule {
}
