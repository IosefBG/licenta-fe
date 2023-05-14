import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellComponent} from "./shell.component";
import {HeaderModule} from "./components/header/header.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    ShellComponent,
  ],
  imports: [
    CommonModule,
    HeaderModule,
    RouterModule
  ],
  exports: [
    ShellComponent
  ],
})
export class ShellModule {
}
