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

  constructor(public activeModal: NgbActiveModal, private readonly apiService: ApiService, private formBuilder: FormBuilder) {
    this.timesheetForm = this.formBuilder.group({
      project: ['', Validators.required],
      hours: ['', Validators.required],
      selectedDate: [''],
      fromDate: [''],
      toDate: [''],
      periodCheckboxChecked: [false]
    });
  }

  ngOnInit() {
    this.timesheetForm.get('selectedDate')?.setValue(this.selectedDay.date);
    this.getProjects();
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
    this.apiService.addTimesheetEntry(this.timesheetForm.value, this.selectedWeek).subscribe((res: any) => {
      console.log(res);
    })
    this.cancelTimesheetModal();
  }
}
