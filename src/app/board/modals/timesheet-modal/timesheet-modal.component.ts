import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timesheet-modal',
  templateUrl: './timesheet-modal.component.html',
  styleUrls: ['./timesheet-modal.component.css']
})
export class TimesheetModalComponent implements OnInit {
  @ViewChild('timesheetModal') timesheetModal!: TemplateRef<any>;
  @Input() inputData:any;

  selectedDay: any;
  timesheetEntry: TimesheetEntry = {hours: null, minutes: null, project: ''};

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    console.log(this.inputData)
  }

  cancelTimesheetModal() {
    this.activeModal.dismiss('cancel');
  }

  addTimesheetEntry() {
    if (this.selectedDay && this.timesheetEntry.hours && this.timesheetEntry.project) {
      const timesheetEntry: TimesheetEntry = {
        hours: this.timesheetEntry.hours,
        minutes: this.timesheetEntry.minutes || 0,
        project: this.timesheetEntry.project
      };
      this.selectedDay.timesheetEntry.push(timesheetEntry);
      this.cancelTimesheetModal();
    }
  }
}

interface TimesheetEntry {
  hours: number | null;
  minutes: number | null;
  project: string;
}
