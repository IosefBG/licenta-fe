import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "../../../shell/api.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-timesheet-modal',
  templateUrl: './timesheet-modal.component.html',
  styleUrls: ['./timesheet-modal.component.css']
})
export class TimesheetModalComponent implements OnInit {
  @ViewChild('timesheetModal') timesheetModal!: TemplateRef<any>;
  @Input() selectedDay: any;
  @Input() selectedWeek: any;
  timesheetForm: FormGroup;
  projects: { projectName: string; projectId: number }[] = [];
  minDate: Date | undefined;
  maxDate: Date | undefined;

  constructor(public activeModal: NgbActiveModal, private readonly apiService: ApiService, private formBuilder: FormBuilder) {
    this.timesheetForm = this.formBuilder.group({
      project: ['', Validators.required],
      hours: ['', Validators.required],
      selectedDate: [''],
      periodCheckboxChecked: [false],
      dateRange: this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      })

    });
  }

  ngOnInit() {
    this.timesheetForm.get('selectedDate')?.setValue(this.selectedDay.date);
    this.getProjects();
    this.calculateMinMaxDates();
  }

  getProjects() {
    this.apiService.getProjectsByUserId().subscribe((res: any) => {
      this.projects = res.map((item: any) => {
        return {
          projectName: item.project.projectName,
          projectId: item.project.id
        };
      });
    });
  }

  cancelTimesheetModal() {
    this.activeModal.dismiss('cancel');
  }

  addTimesheetEntry() {
    console.log(this.timesheetForm.value)
    this.apiService.addTimesheetEntry(this.timesheetForm.value).subscribe((res: any) => {
      console.log(res);
    })
    this.cancelTimesheetModal();
  }

  updateFromDate() {
    const periodCheckboxChecked = this.timesheetForm.get('periodCheckboxChecked')?.value;
    const selectedDate = this.timesheetForm.get('selectedDate')?.value;

    if (periodCheckboxChecked && selectedDate) {
      this.timesheetForm.get('fromDate')?.setValue(selectedDate);
    }
  }

  private calculateMinMaxDates() {
    const startDate = new Date(this.selectedDay.date);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Set to the first day of the week

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Set to the last day of the week

    this.minDate = startDate;
    this.maxDate = endDate;
  }
}
