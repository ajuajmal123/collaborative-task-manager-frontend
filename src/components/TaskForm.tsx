import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";


const taskSchema = z.object({
  title: z.string().max(100, "Title must be under 100 characters"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string().min(1, "Assignee is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useUsers();
const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "MEDIUM",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
  setServerError(null);

  try {
    const payload = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    };

    await api.post("/tasks", payload);
    reset();
  } catch (err: any) {
    setServerError(
      err.response?.data?.message || "Failed to create task"
    );
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded border border-gray-200 mb-6 max-w-md"
    >
      <h2 className="text-lg font-medium mb-3">Create Task</h2>

      {/* TITLE */}
      <input
        {...register("title")}
        placeholder="Task title"
        className="input"
      />
      {errors.title && <p className="error">{errors.title.message}</p>}

      {/* DESCRIPTION */}
      <textarea
        {...register("description")}
        placeholder="Description (optional)"
        className="input mt-3"
      />

      {/* DUE DATE */}
      <input
        type="datetime-local"
        {...register("dueDate")}
        className="input mt-3"
      />
      {errors.dueDate && <p className="error">{errors.dueDate.message}</p>}

      {/* PRIORITY */}
      <select {...register("priority")} className="input mt-3">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      {/* ASSIGNEE DROPDOWN */}
      <select
        {...register("assignedToId")}
        className="input mt-3"
        disabled={isLoading}
      >
        <option value="">Select assignee</option>

        {users?.map((user: any) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      {errors.assignedToId && (
        <p className="error">{errors.assignedToId.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-4"
      >
        {isSubmitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
