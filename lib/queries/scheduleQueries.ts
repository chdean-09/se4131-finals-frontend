import { queryOptions } from "@tanstack/react-query";

enum WeekDays {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface Schedule {
  id: string;
  isEnabled: boolean;
  days: WeekDays[];
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

export const scheduleQuery = () =>
  queryOptions({
    queryKey: ["schedule"],
    queryFn: async (): Promise<Schedule[]> => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_API_URL + "/schedule",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.json();
    },
  });