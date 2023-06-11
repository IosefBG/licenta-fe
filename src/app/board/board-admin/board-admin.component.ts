import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../shell/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;

  myForm: FormGroup = new FormGroup({});
  managers: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  displayedColumns: string[] = ['id', 'username', 'email'];

  dataSource2: any;
  displayedColumns2: string[] = ['projectId', 'projectName','managerId','managerUsername'];
  constructor(private apiService: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.apiService.getManagers().subscribe((data:any) => {
      this.managers = data;
      this.dataSource = new MatTableDataSource(data);
    });
    this.apiService.getManagersProjects().subscribe((data:any) => {
      console.log(data);
      this.dataSource2 = new MatTableDataSource(data);
    });
    this.myForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      managerName: ['', Validators.required]
    });
  }

  submitForm() {
    console.log(this.myForm.value);
    if (this.myForm) {
      this.apiService.addProject(this.myForm.value.projectName, this.myForm.value.managerName)
        .subscribe((res:any) => {
          if(res.status==200)
            console.log("succes")
        });
    }
  }

}
