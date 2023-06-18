import {Component, Input} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../shell/api.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() data: MatTableDataSource<any> = new MatTableDataSource()
  @Input() columns: string[] = [];
  @Input() tableType: string | undefined;
  form: FormGroup = new FormGroup({})

  constructor(private readonly apiService: ApiService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({});

    if (this.tableType === 'user_roles') {
      this.columns = [...this.columns, 'roles', 'actions']
    }
  }

  removeRole(user: any) {
    const roleId = user.selectedRoleId;
    if (roleId) {
      const roleIndex = user.roles.findIndex((role: any) => role.id === roleId);
      this.apiService.removeRole(user.id, roleId).subscribe((res: any) => {
        if (roleIndex !== -1) {
          this.data.data.splice(roleIndex, 1); // Remove the role from the data array
          this.data = new MatTableDataSource(this.data.data); // Recreate the MatTableDataSource with the updated data array
          user.roles.splice(roleIndex, 1); // Remove the role from the user's roles array
        }
      });
    }
  }


  onRoleSelectionChange(event: any, user: any) {
    user.selectedRoleId = event.value;
  }


  getSelectedRoleId(user: any) {
    return user.selectedRoleId;
  }

  acceptTimesheet(timesheet: any) {
    // Logic to accept the timesheet
  }

  rejectTimesheet(timesheet: any) {
    // Logic to reject the timesheet
  }
}
