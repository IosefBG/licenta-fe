import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../shell/api.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-board-manager',
  templateUrl: './board-manager.component.html',
  styleUrls: ['./board-manager.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BoardManagerComponent implements OnInit, AfterViewInit {
  content?: string;
  dataSource!: MatTableDataSource<any>;
  filterControl: FormControl = new FormControl('');
  days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  days_name = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica']
  displayedColumns: string[] = [
    'userid',
    'weekStartDate',
    'weekEndDate',
    ...this.days,
    'status',
    'actions',
  ];
  summarizedData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) {
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit() {
    this.setupFilter();
    this.loadData();
  }

  loadData() {
    this.apiService.getTimesheets().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.summarizeData();
      // console.log(this.dataSource)

      // Create a new MatTableDataSource for the summarized data
      const summarizedDataSource = new MatTableDataSource(this.summarizedData);
      console.log(this.summarizedData)
      summarizedDataSource.paginator = this.paginator;
      summarizedDataSource.sort = this.sort;
      this.dataSource = summarizedDataSource;
    });
  }

  setupFilter() {
    this.filterControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filterValue) => {
        if (this.dataSource) {
          this.dataSource.filter = filterValue.trim().toLowerCase();
        }
      });
  }

  summarizeData() {
    const isDay = (date: string, day: string) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {weekday: 'short'}).toLowerCase() === day.toLowerCase();
    };

    // Map the data to unique rows by weekStartDate and weekEndDate
    const uniqueRows = new Map<string, any>();

    for (const item of this.dataSource.filteredData) {
      const fromDate = new Date(item.fromDate);
      const weekStartDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() - fromDate.getDay() + 1); // Set week start to Monday
      const weekEndDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + (6 - fromDate.getDay())); // Set week end to Sunday

      // const key = `${weekStartDate.toISOString().substring(0, 10)}-${weekEndDate.toISOString().substring(0, 10)}`;
      const key = `${weekStartDate.toISOString().substring(0, 10)}-${weekEndDate.toISOString().substring(0, 10)}-${item.user.id}`;

      if (uniqueRows.has(key)) {
        // Accumulate hours for the same weekStartDate and weekEndDate
        const existingRow = uniqueRows.get(key);
        existingRow.hours += item.hours;

        if (isDay(item.selectedDate, 'mon')) {
          existingRow.mon.push(item);
        }
        if (isDay(item.selectedDate, 'tue')) {
          existingRow.tue.push(item);
        }
        if (isDay(item.selectedDate, 'wed')) {
          existingRow.wed.push(item);
        }
        if (isDay(item.selectedDate, 'thu')) {
          existingRow.thu.push(item);
        }
        if (isDay(item.selectedDate, 'fri')) {
          existingRow.fri.push(item);
        }
        if (isDay(item.selectedDate, 'sat')) {
          existingRow.sat.push(item);
        }
        if (isDay(item.selectedDate, 'sun')) {
          existingRow.sun.push(item);
        }
      } else {
        const newRow = {...item};
        newRow.fromDate = weekStartDate.toISOString().substring(0, 10);
        newRow.toDate = weekEndDate.toISOString().substring(0, 10);
        newRow.mon = isDay(item.selectedDate, 'mon') ? [item] : [];
        newRow.tue = isDay(item.selectedDate, 'tue') ? [item] : [];
        newRow.wed = isDay(item.selectedDate, 'wed') ? [item] : [];
        newRow.thu = isDay(item.selectedDate, 'thu') ? [item] : [];
        newRow.fri = isDay(item.selectedDate, 'fri') ? [item] : [];
        newRow.sat = isDay(item.selectedDate, 'sat') ? [item] : [];
        newRow.sun = isDay(item.selectedDate, 'sun') ? [item] : [];
        uniqueRows.set(key, newRow);
      }
    }

    // Convert the Map to an array of summarized data
    this.summarizedData = Array.from(uniqueRows.values());
  }


  updateStatus(userid: number, status: string, startDate: string, endDate: string) {
    this.apiService.updateTimesheetStatus(userid, status, startDate, endDate).subscribe(() => {
      window.location.reload()
    });
    window.location.reload()
  }
}

