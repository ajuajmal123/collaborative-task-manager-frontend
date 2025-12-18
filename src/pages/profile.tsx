
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Profile() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/users/me");
      setName(res.data.name);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    await api.put("/users/me", { name });
    alert("Profile updated");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">My Profile</h1>

      <input
        className="input"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button className="btn-primary mt-4" onClick={updateProfile}>
        Update Profile
      </button>
    </div>
  );
}
