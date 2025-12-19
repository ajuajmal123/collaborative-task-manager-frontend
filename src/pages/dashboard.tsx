import { useState } from "react";
import Link from "next/link";
import { useTasks, TaskView } from "@/hooks/useTasks";
import { logout } from "@/lib/auth";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Dashboard() {
  const [view, setView] = useState<TaskView>("assigned");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [showForm, setShowForm] = useState(false);

  const { data: tasks, isLoading } = useTasks({
    view,
    status: status || undefined,
    priority: priority || undefined,
    sort,
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <div className="flex gap-4 items-center">
            <Link
              href="/profile"
              className="text-sm text-indigo-600 hover:underline"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "assigned", label: "Assigned to Me" },
            { key: "created", label: "Created by Me" },
            { key: "overdue", label: "Overdue" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key as TaskView)}
              className={`px-4 py-2 rounded text-sm ${
                view === t.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6">
          <select
            className="border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "asc" | "desc")
            }
          >
            <option value="asc">Due Date ↑</option>
            <option value="desc">Due Date ↓</option>
          </select>

          <button
            onClick={() => setShowForm((p) => !p)}
            className="sm:ml-auto bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {showForm ? "Close" : "Create Task"}
          </button>
        </div>

        {/* TASK FORM */}
        {showForm && <TaskForm />}

        {/* TASK LIST */}
        {isLoading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks || []} />
        )}
      </main>
    </div>
  );
}
