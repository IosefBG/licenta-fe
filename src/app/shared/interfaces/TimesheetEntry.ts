export interface TimesheetEntry {
  project: number;
  hours: number;
  selectedDate: Date | null;
  periodCheckboxChecked: boolean;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}
