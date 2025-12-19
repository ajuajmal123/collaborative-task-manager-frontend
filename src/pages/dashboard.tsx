import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import { useTasks } from "@/hooks/useTasks";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { logout } from "@/lib/auth";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: tasks } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  //  Socket connection 
  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    socket.on("task:created", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      disconnectSocket();
    };
  }, [userId, queryClient]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* ACTION BAR */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            {showForm ? "Close" : "Create Task"}
          </button>
        </div>

        {/* TASK FORM */}
        {showForm && (
          <div className="mb-6">
            <TaskForm />
          </div>
        )}

        {/* TASK LIST */}
        <TaskList tasks={tasks || []} />
      </main>
    </div>
  );
}
