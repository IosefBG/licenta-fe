import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const AUTH_API = environment.api + '/auth/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(AUTH_API + 'signin', { username, password });
  }

  register(username: string, email: string, password: string) {
    return this.http.post(AUTH_API + 'signup', { username, email, password });
  }

  logout() {
    return this.http.post(AUTH_API + 'signout', {});
  }

  refreshToken() {
    return this.http.post(AUTH_API + 'refreshtoken', {});
  }
}
