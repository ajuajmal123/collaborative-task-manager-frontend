import { useState } from "react";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

type Task = {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
};

export default function TaskModal({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async () => {
    setSaving(true);
    setError(null);

    try {
      await api.put(`/tasks/${task._id}`, {
        title,
        status,
        priority,
      });

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update task"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editMode ? "Edit Task" : "Task Details"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* VIEW / EDIT FIELDS */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              disabled={!editMode}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              disabled={!editMode}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input w-full"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="REVIEW">REVIEW</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              disabled={!editMode}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input w-full"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="btn-primary"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="text-sm"
              >
                Cancel
              </button>

              <button
                onClick={updateTask}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
