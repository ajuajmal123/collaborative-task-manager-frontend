import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  const onSubmit = async (data: TaskFormData) => {
    await api.post("/tasks", data);
    reset();
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded border border-gray-200 mb-6 max-w-md"
    >
      <h2 className="text-lg font-medium mb-3">Create Task</h2>

      <input
        {...register("title")}
        placeholder="Task title"
        className="input"
      />
      {errors.title && <p className="error">{errors.title.message}</p>}

      <input
        type="date"
        {...register("dueDate")}
        className="input mt-3"
      />
      {errors.dueDate && <p className="error">{errors.dueDate.message}</p>}

      <select {...register("priority")} className="input mt-3">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

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
