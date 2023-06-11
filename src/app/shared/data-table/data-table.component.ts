import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() data: MatTableDataSource<any> = new MatTableDataSource()
  @Input() columns: string[] = [];
  constructor() { }

  ngOnInit(): void {

  }

}
