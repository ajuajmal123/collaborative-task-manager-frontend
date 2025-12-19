import { useEffect, useState } from "react";
import api from "@/lib/api";
import { logout } from "@/lib/auth";

export default function Profile() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setName(res.data.name);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await api.put("/auth/me", { name });
      setMessage("Profile updated successfully");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">My Profile</h1>

          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {message && (
            <p className="text-sm text-green-600">{message}</p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={updateProfile}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <a
            href="/dashboard"
            className="block text-sm text-center text-indigo-600 hover:underline"
          >
            Back to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
