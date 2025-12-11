import { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/profile/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => console.log("Profile fetch error"));
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-8 rounded-xl">
      <h1 className="text-3xl font-semibold text-center mb-6">
        My Profile
      </h1>

      <div className="space-y-4 text-lg">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>User ID:</strong> {user._id}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
