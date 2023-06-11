import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {ApiService} from "../../shell/api.service";
import {debounceTime, distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-board-manager',
  templateUrl: './board-manager.component.html',
  styleUrls: ['./board-manager.component.css']
})
export class BoardManagerComponent implements OnInit {

  content?: string;

  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  filterControl: FormControl = new FormControl('');
  displayedColumns: string[] = ['id', 'username', 'email'];


  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
    this.setupFilter();
  }

  loadData() {
    this.apiService.getUsers().subscribe((data:any) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  setupFilter() {
    this.filterControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(filterValue => {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });
  }

}
