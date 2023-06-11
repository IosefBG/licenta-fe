import {Component, OnInit} from '@angular/core';
import {StorageService} from '../_services/storage.service';
import {ApiService} from "../shell/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private apiService: ApiService, private storageService: StorageService) {
  }


  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      let user: any = this.storageService.getUser();
      this.roles = user.roles;
    }
  }

  onSubmit(): void {
    const {username, password} = this.form;

    this.apiService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        let user: any = this.storageService.getUser();
        this.roles = user.roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
