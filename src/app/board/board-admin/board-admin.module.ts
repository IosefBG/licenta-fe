import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardAdminRoutingModule } from './board-admin-routing.module';
import { BoardAdminComponent } from './board-admin.component';


@NgModule({
  declarations: [
    BoardAdminComponent
  ],
  imports: [
    CommonModule,
    BoardAdminRoutingModule
  ]
})
export class BoardAdminModule { }
