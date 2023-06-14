import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {StorageService} from "../_services/storage.service";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient, private readonly storageService: StorageService) {
    this.apiUrl = environment.api;
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
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
    path: string,
    params: HttpParams | null = null,
    body: any = null
  ): Observable<any> {
    const url = `${this.apiUrl}${path}`;
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
    const body = { username, password };
    return this.makeRequest('POST', 'user/signin', null, body);
  }

  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.makeRequest('POST', 'user/signup', null, body);
  }

  logout(): Observable<any> {
    return this.makeRequest('POST', 'user/signout');
  }

  refreshToken(): Observable<any> {
    return this.makeRequest('POST', 'user/refreshtoken');
  }

  getUsers(): Observable<any> {
    return this.makeRequest('GET', 'manager/users');
  }

  addProject(projectname: string, manager: string): Observable<any> {
    const params = new HttpParams()
      .set('projectName', projectname)
      .set('managerId', manager);
    return this.makeRequest('PUT', 'admin/addProject', params);
  }

  getManagers(): Observable<any> {
    return this.makeRequest('GET', 'admin/getManagers');
  }

  getManagersProjects(): Observable<any> {
    return this.makeRequest('GET', 'admin/getManagersWithProjects');
  }

  addRoles(userId: number, roleId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('roleId', roleId.toString());
    return this.makeRequest('PUT', 'admin/addRoleForUserId', params);
  }

  getUsersWithRoles(): Observable<any> {
    return this.makeRequest('GET', 'admin/getUsersWithRoles');
  }

  removeRole(userId: number, roleId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('roleId', roleId.toString());
    return this.makeRequest('DELETE', 'admin/removeRoleForUserId', params);
  }

  getUsersWithMissingRoles(): Observable<any> {
    return this.makeRequest('GET', 'admin/getUsersWithMissingRoles');
  }

  getProjects(): Observable<any> {
    return this.makeRequest('GET', 'admin/getProjects');
  }

  getUsersWithUserRoles(): Observable<any> {
    return this.makeRequest('GET', 'admin/usersWithUserRole');
  }

  saveUserProject(payload: { userId: any; projectId: any }): Observable<any> {
    const body = {
      userId: payload.userId,
      projectId: payload.projectId,
    };
    return this.makeRequest('PUT', 'admin/addUserProject', null, body);
  }

  getUsersWithProjects(): Observable<any> {
    return this.makeRequest('GET', 'admin/getUsersProjects');
  }

  getProjectsByUserId(): Observable<any> {
    let param = new HttpParams().set('userId', this.storageService.getUser().id);
    return this.makeRequest('GET', 'user/getProjectsByUserId', param);
  }

  addTimesheetEntry(value: any, selectedWeek: any) {
    console.log(value);
    const [startWeekDay, endWeekDay] = selectedWeek.split(" - ").map(Number);
    const params = new HttpParams()
      .set('userId', this.storageService.getUser().id)
      .set('projectId', value.project)
      .set('hours', value.hours)
      .set('weekStartDay', startWeekDay)
      .set('weekEndDay', endWeekDay);

    if (value.selectedDate) {
      const selectedDateWithoutTimezone = new Date(value.selectedDate).toISOString().split('T')[0];
      params.set('selectedDate', selectedDateWithoutTimezone);
    }

    if (value.periodCheckboxChecked) {
      const fromDate = new Date(value.fromDate);
      const toDate = new Date(value.toDate);
      const fromDateFormatted = fromDate.toISOString().split('T')[0];
      const toDateFormatted = toDate.toISOString().split('T')[0];
      params.set('fromDate', fromDateFormatted).set('toDate', toDateFormatted);
    }

    return this.makeRequest('PUT', 'user/addTimesheet', params);
  }


}
