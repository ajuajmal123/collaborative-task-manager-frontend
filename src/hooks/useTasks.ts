import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });
};
