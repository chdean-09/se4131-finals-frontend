import { queryOptions } from "@tanstack/react-query";

enum FeedType {
  SCHEDULED = 'SCHEDULED',
  MANUAL = 'MANUAL',
}

export interface Feed {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: FeedType;
}

export const feedQuery = () =>
  queryOptions({
    queryKey: ["feed"],
    queryFn: async (): Promise<Feed[]> => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_API_URL + "/feed",
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