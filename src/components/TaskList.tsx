import { useState } from "react";
import TaskEditModal from "./TaskEditModal";
type UserRef = {
  _id: string;
  name: string;
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string;
  creatorId: UserRef;
  assignedToId: UserRef;
};


export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!tasks.length) {
    return <p className="text-gray-500">No tasks available.</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-medium">{task.title}</h3>

              <p className="text-sm text-gray-500 mt-1">
                Status: {task.status}
              </p>

              <p className="text-sm text-gray-500">
                Priority: {task.priority}
              </p>

              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleString()}
              </p>
            </div> 

           <button
  onClick={() => setSelectedTask(task)}
  className="text-sm text-indigo-600"
>
  View / Edit
</button>

          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskEditModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
