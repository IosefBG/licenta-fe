import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from "../../shell/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";

export interface UserWithMissingRoles {
  id: number;
  username: string;
  email: string;
  missingRoles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class BoardAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  userRole: FormGroup = new FormGroup({});
  managers: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  usersWithRoles: MatTableDataSource<any> = new MatTableDataSource()
  usersWithMissingRoles: UserWithMissingRoles[] = [];
  usersWithUserRoles: any[] = [];
  projects: any[] = [];
  displayedColumns: string[] = ['id', 'username', 'email'];
  userProjectForm: FormGroup = new FormGroup({});
  dataSource2: any;
  displayedColumns2: string[] = ['projectId', 'projectName', 'managerId', 'managerUsername'];
  displayedColumns3: string[] = ['id', 'username'];
  displayedColumns4 = [
    'userProjectId',
    'userId',
    'username',
    'email',
    'projectId',
    'projectName',
    'managerId',
    'managerUsername',
    'managerEmail',
  ];
  dataSource4: MatTableDataSource<any> = new MatTableDataSource()
  selectedUser: UserWithMissingRoles | undefined;
  reportForm: FormGroup = new FormGroup({})


  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.userProjectForm = this.formBuilder.group({
      selectedUser: ['', Validators.required],
      selectedProject: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reportForm = this.formBuilder.group({
      startDate: [''], // Add default or initial value if needed
      endDate: [''], // Add default or initial value if needed
    });
    this.apiService.getManagers().subscribe((data: any) => {
      this.managers = data;
      this.dataSource = new MatTableDataSource(data);
    });
    this.apiService.getManagersProjects().subscribe((data: any) => {
      this.dataSource2 = new MatTableDataSource(data);
    });
    this.apiService.getUsersWithMissingRoles().subscribe((data: UserWithMissingRoles[]) => {
      this.usersWithMissingRoles = data;
    });
    this.apiService.getUsersWithRoles().subscribe((data: any) => {
      this.usersWithRoles = new MatTableDataSource(data);
    });
    this.apiService.getUsersWithUserRoles().subscribe((data: any) => {
      this.usersWithUserRoles = data;
    });
    this.apiService.getProjects().subscribe((data: any) => {
      this.projects = data;
    });
    this.apiService.getUsersWithProjects().subscribe((data: any) => {
      // this.usersWithProjects = data;
      this.dataSource4 = new MatTableDataSource(data);
    });
    this.myForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      managerName: ['', Validators.required]
    });
    this.userRole = this.formBuilder.group({
      userId: ['', Validators.required],
      userRoleId: ['', Validators.required]
    });
  }

  onUserSelectionChange(userId: number) {
    this.selectedUser = this.usersWithMissingRoles.find(user => user.id === userId);
  }

  submitForm() {
    if (this.myForm) {
      this.apiService.addProject(this.myForm.value.projectName, this.myForm.value.managerName)
        .subscribe((res: any) => {
          if (res.status == 200)
            console.log("succes")
        });
    }
  }

  addUserRole() {
    this.apiService.addRoles(this.userRole.value.userId, this.userRole.value.userRoleId).subscribe(
      () => {
        console.log("succes")
      },
      (error: any) => {
        if (error.status === 500) {
          console.log('User not found');
        }
      }
    );
  }

  onUserProjectFormSubmit() {
    if (this.userProjectForm.valid) {
      const payload = {
        userId: this.userProjectForm.value.selectedUser.id,
        projectId: this.userProjectForm.value.selectedProject.id
      };

      this.apiService.saveUserProject(payload).subscribe((res: any) => {
        console.log(res)
      });
    }
  }

  downloadReport() {
    const startDate = this.reportForm.get('startDate')?.value.toISOString().split('T')[0];
    const endDate = this.reportForm.get('endDate')?.value.toISOString().split('T')[0];
    this.apiService.downloadExcelFile(startDate, endDate).subscribe((data: ArrayBuffer) => {
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'timesheet_report.xlsx';
      link.click();
    });
  }
}
