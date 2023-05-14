import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardUserRoutingModule } from './board-user-routing.module';
import { BoardUserComponent } from './board-user.component';


@NgModule({
  declarations: [
    BoardUserComponent
  ],
  imports: [
    CommonModule,
    BoardUserRoutingModule
  ]
})
export class BoardUserModule { }
