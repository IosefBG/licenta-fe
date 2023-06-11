import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardManagerComponent } from './board-manager.component';

const routes: Routes = [{ path: '', component: BoardManagerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardManagerRoutingModule { }
