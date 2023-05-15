import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

const API_URL = environment.api + '/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpOptions:any = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
    responseType: 'text',
  };

  constructor(private http: HttpClient) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', this.httpOptions);
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', this.httpOptions);
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', this.httpOptions);
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', this.httpOptions);
  }
}
