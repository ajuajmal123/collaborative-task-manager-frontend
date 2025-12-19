import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import { useMe } from "@/hooks/useMe";
import { useUsers } from "@/hooks/useUsers";

/* =====================
   TYPES
===================== */

type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  creatorId: { _id: string; name: string };
  assignedToId: { _id: string; name: string };
};

const editTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
  assignedToId: z.string().optional(),
});

type EditTaskData = z.infer<typeof editTaskSchema>;

interface Props {
  task: Task;
  onClose: () => void;
}

/* =====================
   COMPONENT
===================== */

export default function TaskEditModal({ task, onClose }: Props) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { data: users } = useUsers();

  const isCreator = me?._id === task.creatorId._id;
  const isAssignee = me?._id === task.assignedToId._id;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditTaskData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 16)
        : undefined,
      priority: task.priority,
      status: task.status,
      assignedToId: task.assignedToId._id,
    },
  });

  const onSubmit = async (data: EditTaskData) => {
    const payload: any = {
      status: data.status, // both creator & assignee
    };

    // creator-only editable fields
    if (isCreator) {
      Object.assign(payload, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignedToId: data.assignedToId,
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString()
          : undefined,
      });
    }

    await api.put(`/tasks/${task._id}`, payload);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    await api.delete(`/tasks/${task._id}`);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

        {/* META INFO */}
        <div className="text-sm text-gray-600 mb-4">
          <p>Created by: <b>{task.creatorId.name}</b></p>
          <p>Assigned to: <b>{task.assignedToId.name}</b></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STATUS (editable by creator & assignee) */}
          <label className="block text-sm font-medium">Status</label>
          <select {...register("status")} className="input">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* TITLE */}
          <label className="block text-sm font-medium mt-3">Title</label>
          <input
            {...register("title")}
            className="input"
            disabled={!isCreator}
          />

          {/* DESCRIPTION */}
          <label className="block text-sm font-medium mt-3">Description</label>
          <textarea
            {...register("description")}
            className="input"
            disabled={!isCreator}
          />

          {/* DUE DATE */}
          <label className="block text-sm font-medium mt-3">Due Date</label>
          <input
            type="datetime-local"
            {...register("dueDate")}
            className="input"
            disabled={!isCreator}
          />

          {/* PRIORITY */}
          <label className="block text-sm font-medium mt-3">Priority</label>
          <select
            {...register("priority")}
            className="input"
            disabled={!isCreator}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* ASSIGNEE */}
          <label className="block text-sm font-medium mt-3">Assigned To</label>
          <select
            {...register("assignedToId")}
            className="input"
            disabled={!isCreator}
          >
            {users?.map((u: any) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* ACTIONS */}
          <div className="flex justify-between items-center mt-6">
            {isCreator && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-600 text-sm hover:underline"
              >
                Delete Task
              </button>
            )}

            <div className="ml-auto space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
