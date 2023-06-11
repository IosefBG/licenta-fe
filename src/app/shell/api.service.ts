import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
};

const httpOptions2 = {
  authorization: 'Bearer ' + localStorage.getItem('token'),
  withCredentials: true,
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'auth/signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'auth/signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'auth/signout', {}, httpOptions);
  }

  refreshToken() {
    return this.http.post(AUTH_API + 'auth/refreshtoken', {}, httpOptions);
  }

  getUsers() {
    return this.http.get(AUTH_API + 'manager/users', httpOptions2);
  }

  addProject(projectname: string, manager: string) {
    let params = new HttpParams();
    params = params.append('projectName', projectname).append('managerId', manager);
    return this.http.put(AUTH_API + 'admin/addProject', params,httpOptions2)
  }
  getManagers() {
    return this.http.get(AUTH_API + 'admin/getManagers', httpOptions2)
  }

  getManagersProjects() {
    return this.http.get(AUTH_API + 'admin/getManagersWithProjects', httpOptions2)
  }
}
