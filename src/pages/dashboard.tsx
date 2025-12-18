import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { useTasks } from "@/hooks/useTasks";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { logout } from "@/lib/auth";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: tasks } = useTasks();

  const [showForm, setShowForm] = useState(false);

  // Socket.io
  useEffect(() => {
    const socket = connectSocket("temp-user-id");

    socket.on("task:created", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => disconnectSocket();
  }, [queryClient]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
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

        {/* TASK FORM (TOGGLED) */}
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
