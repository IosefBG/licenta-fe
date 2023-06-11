import {Component, OnInit} from '@angular/core';
import {throwError} from "rxjs";
import {StorageService} from "../../../_services/storage.service";
import {catchError} from "rxjs/operators";
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showManagerBoard = false;
  username?: string;

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user: any = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showManagerBoard = this.roles.includes('ROLE_MANAGER');

      this.username = user.username;
    }

  }

  logout(): void {
    this.apiService.logout().pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    ).subscribe(() => {
      this.storageService.logout();
    });
  }

}
