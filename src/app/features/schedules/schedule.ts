export interface Schedule {
  id: number;

  title: string;
  description?: string;

  startDate: string;
  endDate?: string;

  startTime?: string;
  endTime?: string;

  fullDay: boolean;
}
