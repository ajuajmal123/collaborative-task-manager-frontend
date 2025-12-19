import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type TaskView = "assigned" | "created" | "overdue";

type UseTasksParams = {
  view: TaskView;
  status?: string;
  priority?: string;
  sort?: "asc" | "desc";
};

export const useTasks = ({
  view,
  status,
  priority,
  sort,
}: UseTasksParams) => {
  return useQuery({
    queryKey: ["tasks", view, status, priority, sort],
    queryFn: async () => {
      const res = await api.get("/tasks", {
        params: {
          view,
          status,
          priority,
          sortByDueDate: sort,
        },
      });
      return res.data;
    },
  });
};
