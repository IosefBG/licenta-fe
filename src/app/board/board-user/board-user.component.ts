import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TimesheetModalComponent} from '../modals/timesheet-modal/timesheet-modal.component';

interface Day {
  date: Date;
  timesheetEntry?: TimesheetEntry; // Updated type to TimesheetEntry
}

interface TimesheetEntry {
  project: string;
  hours: number | null;
  minutes: number | null;
}

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent {
  selectedDate: Date;
  calendarWeeks: Day[][] = [];
  selectedDay: Day | null = null;
  timesheetEntry: TimesheetEntry = { project: '', hours: null, minutes: null };
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

    currentDate.setDate(currentDate.getDate() - startOfMonth);

    const weeks: Day[][] = [];

    for (let i = 0; i < 5; i++) {
      const week: Day[] = [];

      for (let j = 0; j < 7; j++) {
        const day: Day = { date: new Date(currentDate), timesheetEntry: undefined };
        week.push(day);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
    }

    this.calendarWeeks = weeks;
  }

  getWeekNumber(date: Date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekOffset = (startOfMonth.getDay() + 6) % 7;
    const currentDay = date.getDate();

    let weekNumber = Math.ceil((currentDay - 1 + weekOffset) / 7);
    if (weekNumber === 0) {
      const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
      weekNumber = Math.ceil((prevMonthLastDay - startOfMonth.getDay() + 1 + weekOffset) / 7);
    }
    return weekNumber;
  }

  getWeekPeriod(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() - date.getDay() + 6);

    return `${startOfWeek.getDate()} - ${endOfWeek.getDate()}`;
  }

  getDisplayedDays() {
    const currentWeek = this.calendarWeeks.find((week) => this.getWeekNumber(week[0].date) === this.getWeekNumber(this.selectedDate));
    return currentWeek ? currentWeek : [];
  }

  openModal(day: Day) {
    this.selectedDay = day;
  }

  openTimesheetModal(day: Day) {
    this.selectedDay = day;
    this.timesheetEntry = { project: '', hours: null, minutes: null };

    // Open the timesheet entry modal using ng-bootstrap with the defined options
    const modalRef = this.modalService.open(TimesheetModalComponent, {backdropClass: 'custom-modal-backdrop'});
    modalRef.result.then((result) => {
      if (result === 'save') {
        this.addTimesheetEntry();
      } else {
        this.cancelModal();
      }
    }, () => {
      this.cancelModal();
    });
  }

  addTimesheetEntry() {
    if (this.selectedDay && this.selectedDay.timesheetEntry && this.timesheetEntry.project && this.timesheetEntry.hours) {
      this.selectedDay.timesheetEntry = {
        project: this.timesheetEntry.project,
        hours: this.timesheetEntry.hours,
        minutes: this.timesheetEntry.minutes || null
      }; // Assign the timesheet entry to the day
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

