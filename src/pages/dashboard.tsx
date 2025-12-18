import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTasks } from "@/hooks/useTasks";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: tasks } = useTasks();

  useEffect(() => {
    // TEMP userId (replace if you fetch from /auth/me)
    const socket = connectSocket("logged-in-user-id");

    socket.on("task:created", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      disconnectSocket();
    };
  }, [queryClient]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>

      <div className="grid gap-4">
        {tasks?.map((task: any) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded border"
          >
            <h2 className="font-medium">{task.title}</h2>
            <p className="text-sm text-gray-500">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
