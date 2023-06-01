export interface Schedule {
    id: number;

    title: string;
    description?: string;

    startDate: Date;
    endDate?: Date;

    startTime?: string;
    endTime?: string;

    fullDay: boolean;
}
