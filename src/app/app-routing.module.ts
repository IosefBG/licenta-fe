import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ShellModule} from "./shell/shell.module";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  {path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)},
  {path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)},
  {
    path: 'admin',
    loadChildren: () => import('./board/board-admin/board-admin.module').then(m => m.BoardAdminModule)
  },
  {
    path: 'timesheet',
    loadChildren: () => import('./board/board-user/board-user.module').then(m => m.BoardUserModule)
  },
  { path: 'manage', loadChildren: () => import('./board/board-manager/board-manager.module').then(m => m.BoardManagerModule) },
]

@NgModule({
  imports: [RouterModule.forRoot(routes), ShellModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
