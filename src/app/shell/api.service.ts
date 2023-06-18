import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {StorageService} from "../_services/storage.service";
import {TimesheetEntry} from "../shared/interfaces/TimesheetEntry";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient, private readonly storageService: StorageService) {
    this.apiUrl = environment.api;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
  }

  private buildRequestOptions(params: HttpParams | null = null): any {
    const headers = this.getHeaders();
    return {
      headers: headers,
      withCredentials: true,
      params: params,
    };
  }

  private handleResponse(response: Observable<any>): Observable<any> {
    return response;
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
      case 'DOWNLOAD':
        requestOptions.responseType = 'arraybuffer' as 'json'; // Set the responseType to arraybuffer
        response = this.http.get(url, requestOptions);
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

  addDays(date: Date | null, days: number): Date | null {
    if (!date) {
      return null;
    }
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addTimesheetEntry(value: TimesheetEntry) {
    if (value.periodCheckboxChecked) {
      value.selectedDate = null;
    } else {
      value.dateRange.startDate = null;
      value.dateRange.endDate = null;
    }
    const body = {
      userId: this.storageService.getUser().id,
      projectId: value.project,
      hours: value.hours,
      selectedDate: value.selectedDate,
      fromDate: this.addDays(value.dateRange.startDate, 1),
      toDate: this.addDays(value.dateRange.endDate, 1),
    }
    return this.makeRequest('PUT', 'user/addTimesheet', null, body);
  }


  getUserTimesheet() {
    let param = new HttpParams().set('userId', this.storageService.getUser().id);
    return this.makeRequest('GET', 'user/getTimesheetByUserId', param);
  }

  getTimesheetByUserIdAndWeek(weekStartDate: string) {
    let param = new HttpParams().set('userId', this.storageService.getUser().id).set('weekStartDate', weekStartDate)
    // const userId = this.storageService.getUser().id;
    // const url = `user/getTimesheetByUserId?userId=${userId}&weekStartDate=${weekStartDate}`;
    return this.makeRequest('GET', 'user/getTimesheetByUserId', param);
  }

  deleteTimesheetEntry(timesheetId: number) {
    let param = new HttpParams().set('timesheetId', timesheetId.toString());
    return this.makeRequest('DELETE', `user/deleteTimesheetEntry`, param);
  }

  updateTimesheetStatus(pending: string, startweek: string, endweek: string) {
    let param = new HttpParams().set('userId', this.storageService.getUser().id).set('status', pending).set('startWeek', startweek).set('endWeek', endweek);
    return this.makeRequest('POST', `user/updateTimesheetEntry`, param);
  }

  getTimesheets() {
    return this.makeRequest('GET', 'manager/users');
  }

  downloadExcelFile(fromDate:string,toDate:string): Observable<ArrayBuffer> {
    // const fromDate = '2023-06-12'; // Specify the fromDate value
    // const toDate = '2023-06-25'; // Specify the toDate value
    let param = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.makeRequest('DOWNLOAD', 'admin/generateRaporttimesheets', param);
  }

}
