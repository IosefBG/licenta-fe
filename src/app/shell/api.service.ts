import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    return headers;
  }

  private buildRequestOptions(params: HttpParams | null = null): any {
    const headers = this.getHeaders();
    const requestOptions = {
      headers: headers,
      withCredentials: true,
      params: params,
    };
    return requestOptions;
  }

  private handleResponse(response: Observable<any>): Observable<any> {
    return response;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  private makeRequest(
    method: string,
    url: string,
    params: HttpParams | null = null,
    body: any = null
  ): Observable<any> {
    const requestOptions = this.buildRequestOptions(params);
    let response: Observable<any>;

    switch (method) {
      case 'GET':
        response = this.http.get(url, requestOptions);
        break;
      case 'POST':
        response = this.http.post(url, body, requestOptions);
        break;
      case 'PUT':
        response = this.http.put(url, body, requestOptions);
        break;
      case 'DELETE':
        response = this.http.delete(url, requestOptions);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return this.handleResponse(response);
  }

  login(username: string, password: string): Observable<any> {
    const url = environment.api + 'auth/signin';
    const body = { username, password };
    return this.makeRequest('POST', url, null, body);
  }

  register(username: string, email: string, password: string): Observable<any> {
    const url = environment.api + 'auth/signup';
    const body = { username, email, password };
    return this.makeRequest('POST', url, null, body);
  }

  logout(): Observable<any> {
    const url = environment.api + 'auth/signout';
    return this.makeRequest('POST', url);
  }

  refreshToken(): Observable<any> {
    const url = environment.api + 'auth/refreshtoken';
    return this.makeRequest('POST', url);
  }

  getUsers(): Observable<any> {
    const url = environment.api + 'manager/users';
    return this.makeRequest('GET', url);
  }

  addProject(projectname: string, manager: string): Observable<any> {
    const url = environment.api + 'admin/addProject';
    const params = new HttpParams()
      .set('projectName', projectname)
      .set('managerId', manager);
    return this.makeRequest('PUT', url, params);
  }

  getManagers(): Observable<any> {
    const url = environment.api + 'admin/getManagers';
    return this.makeRequest('GET', url);
  }

  getManagersProjects(): Observable<any> {
    const url = environment.api + 'admin/getManagersWithProjects';
    return this.makeRequest('GET', url);
  }

  addRoles(userId: number, roleId: number): Observable<any> {
    const url = environment.api + 'admin/addRoleForUserId';
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('roleId', roleId.toString());
    return this.makeRequest('PUT', url, params);
  }

  getUsersWithRoles(): Observable<any> {
    const url = environment.api + 'admin/getUsersWithRoles';
    return this.makeRequest('GET', url);
  }

  removeRole(userId: number, roleId: number): Observable<any> {
    const url = environment.api + 'admin/removeRoleForUserId';
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('roleId', roleId.toString());
    return this.makeRequest('DELETE', url, params);
  }

  getUsersWithMissingRoles(): Observable<any> {
    const url = environment.api + 'admin/getUsersWithMissingRoles';
    return this.makeRequest('GET', url);
  }

  getProjects(): Observable<any> {
    const url = environment.api + 'admin/getProjects';
    return this.makeRequest('GET', url);
  }

  getUsersWithUserRoles(): Observable<any> {
    const url = environment.api + 'admin/usersWithUserRole';
    return this.makeRequest('GET', url);
  }

  saveUserProject(payload: { userId: any; projectId: any }): Observable<any> {
    const url = environment.api + 'admin/addUserProject';
    const body = {
      userId: payload.userId,
      projectId: payload.projectId,
    };
    return this.makeRequest('PUT', url, null, body);
  }

  getUsersWithProjects(): Observable<any> {
    const url = environment.api + 'admin/getUsersProjects';
    return this.makeRequest('GET', url, null,null);
  }
}
