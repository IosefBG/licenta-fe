import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";

const AUTH_API = environment.api + '/auth/';
``
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  credentials: true
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private readonly storageService: StorageService) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout() {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }

  refreshToken() {
    return this.http.post(AUTH_API + 'refreshtoken', {}, httpOptions);
  }
}
