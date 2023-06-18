import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TimesheetModalComponent} from '../modals/timesheet-modal/timesheet-modal.component';
import {ApiService} from '../../shell/api.service';

interface TimesheetEntry {
  project: string;
  hours: number | null;
  minutes: number | null;
}

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css'],
})
export class BoardUserComponent implements OnInit {
  selectedDate: Date;
  calendarWeeks: any[][] = [];
  selectedDay: any | null = null;
  timesheetEntry: TimesheetEntry = {project: '', hours: null, minutes: null};

  constructor(private modalService: NgbModal, private apiService: ApiService) {
    this.selectedDate = new Date();
    this.generateCalendarWeeks();
  }

  ngOnInit(): void {
    this.getTimesheet()
  }

  getTimesheet() {
    this.getTimesheetEntry(this.getDisplayedDays()[0].date.toISOString().split('T')[0]);
  }

  generateCalendarWeeks() {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(1);
    const startOfMonth = currentDate.getDay();
    const startOfWeek = startOfMonth === 0 ? 6 : startOfMonth - 1; // Adjust to start the week from Monday

    currentDate.setDate(currentDate.getDate() - startOfWeek);

    const weeks: any[][] = [];

    while (weeks.length < 6) {
      const week: any[] = [];

      for (let j = 0; j < 7; j++) {
        const day: any = {displayProject: '', date: new Date(currentDate), timesheetEntry: undefined};
        week.push(day);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);

      if (currentDate.getMonth() !== this.selectedDate.getMonth()) {
        break;
      }
    }

    this.calendarWeeks = weeks;
  }

  getWeekNumber(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);

    const weekNumber = Math.ceil(startOfWeek.getDate() / 7);
    const monthName = startOfWeek.toLocaleString('default', {month: 'long'});

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthPeriod = `${startOfMonth.getDate()} - ${endOfMonth.getDate()}`;

    return `${monthName} ${monthPeriod}\n Week ${weekNumber}`;
  }

  getWeekPeriod(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);

    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() - date.getDay() + 7);

    return `${startOfWeek.getDate()} - ${endOfWeek.getDate()}`;
  }

  getDisplayedDays() {
    const currentWeek = this.calendarWeeks.find(
      (week) => this.getWeekNumber(week[0].date) === this.getWeekNumber(this.selectedDate)
    );

    if (currentWeek) {
      return currentWeek.slice(0, 7).map((day) => {
        const timesheetEntry = day.timesheetEntry;
        if (timesheetEntry && timesheetEntry.projects.length > 0) {
          day.displayProjects = timesheetEntry.projects.map((project: any) => project.projectName);
        } else {
          day.displayProjects = [];
        }
        return day;
      });
    }

    return [];
  }


  openModal(day: any) {
    this.selectedDay = day;
  }

  getTimesheetEntry(weekStartDate: string) {
    this.apiService.getTimesheetByUserIdAndWeek(weekStartDate).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.populateTimesheetEntries(data);
      }
    });
  }


  populateTimesheetEntries(entries: any[]) {
    // Iterate over the API response entries and update the calendarWeeks data structure
    entries.forEach((entry) => {
      const selectedDate = new Date(entry.selectedDate);
      const weekIndex = this.calendarWeeks.findIndex((week) => {
        return week.some((day) => {
          return this.isSameDate(day.date, selectedDate);
        });
      });

      if (weekIndex !== -1) {
        const dayIndex = this.calendarWeeks[weekIndex].findIndex((day) => {
          return this.isSameDate(day.date, selectedDate);
        });

        if (dayIndex !== -1) {
          const day = this.calendarWeeks[weekIndex][dayIndex];
          const projectEntry = {
            id: entry.id,
            projectName: entry.project.project.projectName,
            hours: entry.hours,
            status: entry.status,
          };
          if (!day.timesheetEntry) {
            day.timesheetEntry = {projects: [projectEntry], hours: entry.hours};
          } else {
            day.timesheetEntry.projects.push(projectEntry);
            day.timesheetEntry.hours += entry.hours;
          }
        }
      }
    });
  }


  isSameDate(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  openTimesheetModal(day: any) {
    this.selectedDay = day;
    this.timesheetEntry = {project: '', hours: null, minutes: null};
    const modalRef = this.modalService.open(TimesheetModalComponent, {backdropClass: 'custom-modal-backdrop'});
    modalRef.componentInstance.selectedDay = day;
    modalRef.componentInstance.selectedWeek = this.getWeekPeriod(this.selectedDate);
    modalRef.componentInstance.output.subscribe((result: TimesheetEntry) => {
      this.updateTimesheetEntry(result);
      window.location.reload();
    });
    modalRef.result.then(
      (result) => {
        if (result === 'save') {
          this.addTimesheetEntry();
        } else {
          this.cancelModal();
        }
      },
      () => {
        this.cancelModal();
      }
    );
  }

  updateTimesheetEntry(newEntry: TimesheetEntry) {
    if (this.selectedDay) {
      this.selectedDay.timesheetEntry = newEntry;
    }
  }

  addTimesheetEntry() {
    if (
      this.selectedDay &&
      this.selectedDay.timesheetEntry &&
      this.timesheetEntry.project &&
      this.timesheetEntry.hours
    ) {
      this.updateTimesheetEntry({
        project: this.timesheetEntry.project,
        hours: this.timesheetEntry.hours,
        minutes: this.timesheetEntry.minutes || null,
      });
      this.cancelModal();
      this.getTimesheet()
      // this.getTimesheetEntry(this.getDisplayedDays()[0].date.toISOString().split('T')[0]);
    }
  }

  cancelModal() {
    this.selectedDay = null;
    this.timesheetEntry.project = '';
    this.timesheetEntry.hours = null;
    this.timesheetEntry.minutes = null;
  }

  changeWeek(offset: number) {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() + offset * 7);
    this.selectedDate = currentDate;
    this.generateCalendarWeeks();
    this.getTimesheet()
    // this.getTimesheetEntry(this.getDisplayedDays()[0].date.toISOString().split('T')[0]);
  }

  deleteTimesheetRecord(timesheetId: number) {
    this.apiService.deleteTimesheetEntry(timesheetId).subscribe(() => {
      window.location.reload();
      // this.getTimesheet()
      // this.getTimesheetEntry(this.getDisplayedDays()[0].date.toISOString().split('T')[0]);
    });
  }

  sendTimesheet(days: any) {
    const startweek = days[0].date.toISOString().split('T')[0]
    const endweek = days[days.length - 1].date.toISOString().split('T')[0]
    this.apiService.updateTimesheetStatus('In asteptare', startweek, endweek).subscribe(() => {
      window.location.reload();
    });
  }
  getFirstStatus(days: any[]): string {
    // Iterate over the days to find the first status from the projects
    for (const day of days) {
      if (day.timesheetEntry && day.timesheetEntry.projects.length > 0) {
        const firstProjectStatus = day.timesheetEntry.projects[0].status;
        if (firstProjectStatus) {
          return firstProjectStatus;
        }
      }
    }
    // Return a default status if no projects are found
    return 'Nu s-a gasit nici un proiect';
  }

}
