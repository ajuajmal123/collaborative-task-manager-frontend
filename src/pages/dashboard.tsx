import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTasks } from "@/hooks/useTasks";
import { connectSocket, disconnectSocket } from "@/lib/socket";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: tasks } = useTasks();

  useEffect(() => {
    const socket = connectSocket("temp-user-id");

    socket.on("task:created", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("notification:taskAssigned", () => {
      alert("A task was assigned to you");
    });

    return () => {
      disconnectSocket();
    };
  }, [queryClient]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <TaskForm />

      <TaskList tasks={tasks || []} />
    </div>
  );
}
