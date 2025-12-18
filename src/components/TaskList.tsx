type Task = {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
};

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks?.length) {
    return <p className="text-gray-500">No tasks found.</p>;
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 rounded border border-gray-200"
        >
          <h3 className="font-medium">{task.title}</h3>

          <p className="text-sm text-gray-500">
            Status: {task.status}
          </p>

          <p className="text-sm text-gray-500">
            Priority: {task.priority}
          </p>

          <p className="text-sm text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
