import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationPanel() {
  const { notifications } = useNotifications();

  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border shadow-lg rounded p-4 z-50">
      <h4 className="font-semibold mb-2">Notifications</h4>

      {notifications.map((n, i) => (
        <div key={i} className="text-sm border-b py-1">
          {n.message}
        </div>
      ))}
    </div>
  );
}
