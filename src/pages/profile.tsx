import { useEffect, useState } from "react";
import api from "@/lib/api";
import { logout } from "@/lib/auth";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/me").then(res => setUser(res.data));
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-80 space-y-3">
        <h1 className="text-lg font-semibold">Profile</h1>

        <p className="text-sm">User ID:</p>
        <p className="text-xs break-all text-gray-600">
          {user.userId}
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
