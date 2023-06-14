import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TimesheetModalComponent} from '../modals/timesheet-modal/timesheet-modal.component';

interface Day {
  date: Date;
  timesheetEntry?: TimesheetEntry;
}

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
export class BoardUserComponent {
  selectedDate: Date;
  calendarWeeks: Day[][] = [];
  selectedDay: Day | null = null;
  timesheetEntry: TimesheetEntry = {project: '', hours: null, minutes: null};
  projects: string[] = ['Project 1', 'Project 2', 'Project 3'];
  showAddIcon: { [date: string]: boolean } = {};

  constructor(private modalService: NgbModal) {
    this.selectedDate = new Date();
    this.generateCalendarWeeks();
  }

  generateCalendarWeeks() {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(1);
    const startOfMonth = currentDate.getDay();
    const startOfWeek = startOfMonth === 0 ? 6 : startOfMonth - 1; // Adjust to start the week from Monday

    currentDate.setDate(currentDate.getDate() - startOfWeek);

    const weeks: Day[][] = [];

    while (weeks.length < 6) {
      const week: Day[] = [];

      for (let j = 0; j < 7; j++) {
        const day: Day = { date: new Date(currentDate), timesheetEntry: undefined };
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
    return currentWeek ? currentWeek.slice(0, 7) : [];
  }

  openModal(day: Day) {
    this.selectedDay = day;
  }

  openTimesheetModal(day: Day) {
    this.selectedDay = day;
    this.timesheetEntry = {project: '', hours: null, minutes: null};
    const modalRef = this.modalService.open(TimesheetModalComponent, {backdropClass: 'custom-modal-backdrop'});
    modalRef.componentInstance.selectedDay = day;
    modalRef.componentInstance.selectedWeek = this.getWeekPeriod(this.selectedDate);
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

  addTimesheetEntry() {
    if (
      this.selectedDay &&
      this.selectedDay.timesheetEntry &&
      this.timesheetEntry.project &&
      this.timesheetEntry.hours
    ) {
      this.selectedDay.timesheetEntry = {
        project: this.timesheetEntry.project,
        hours: this.timesheetEntry.hours,
        minutes: this.timesheetEntry.minutes || null,
      };
      this.cancelModal();
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
  }
}
