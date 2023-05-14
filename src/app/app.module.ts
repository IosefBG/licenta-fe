import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardModeratorComponent} from './board-moderator/board-moderator.component';

import {httpInterceptorProviders} from './_helpers/http.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ShellModule} from "./shell/shell.module";
import {HomeModule} from "./home/home.module";
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {ProfileModule} from "./profile/profile.module";
import {BoardAdminModule} from "./board/board-admin/board-admin.module";

@NgModule({
  declarations: [
    AppComponent,
    BoardModeratorComponent,
    // BoardUserComponent,
  ],
  imports: [
    HomeModule,
    LoginModule,
    RegisterModule,
    ProfileModule,
    BoardAdminModule,
    BrowserModule,
    ShellModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
