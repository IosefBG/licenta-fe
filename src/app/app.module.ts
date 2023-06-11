import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {httpInterceptorProviders} from './_helpers/http.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ShellModule} from "./shell/shell.module";
import {HomeModule} from "./home/home.module";
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {ProfileModule} from "./profile/profile.module";
import {BoardAdminModule} from "./board/board-admin/board-admin.module";
import {BoardUserModule} from "./board/board-user/board-user.module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TimesheetModalModule} from './board/modals/timesheet-modal/timesheet-modal.module';
import {BoardManagerModule} from "./board/board-manager/board-manager.module";
import {MatTableModule} from "@angular/material/table";
import {DataTableModule} from "./shared/data-table/data-table.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HomeModule,
    LoginModule,
    RegisterModule,
    ProfileModule,
    BoardAdminModule,
    BoardUserModule,
    BoardManagerModule,
    BrowserModule,
    ShellModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    TimesheetModalModule,
    MatTableModule,
    DataTableModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
