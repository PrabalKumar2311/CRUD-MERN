import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Trash, Pencil, Heart } from "lucide-react";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/user/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete user");
        return;
      }

      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  //SEARCH
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase()) ||
      user.age.toString().includes(search),
  );

  // 🔥 store throttle per user
const throttleMap = {};


const throttledLikeUser = (id) => {
  if (!throttleMap[id]) {
    let lastCall = 0;

    throttleMap[id] = async (userId) => {
      const now = Date.now();

      if (now - lastCall < 2000) return;
      lastCall = now;

      try {
        const response = await fetch(
          `http://localhost:3000/user/like/${userId}`,
          { method: "PUT" }
        );

        if (!response.ok) return;

        // ✅ update UI ONLY after success
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, likes: (u.likes || 0) + 1 }
              : u
          )
        );
      } catch (err) {
        console.error(err);
      }
    };
  }

  throttleMap[id](id);
};

function throttle(func, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

  return (
    <div className="min-h-screen bg-gray-500 px-4 sm:px-6 lg:px-10 py-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <FaPlus />
        </button>
      </div>

      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search name, email, department, age..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-amber-50 rounded-lg p-3 bg-gray-400"
        />
      </div>

      {/* USER LIST */}
      <div className="max-w-7xl mx-auto grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] justify-start">
        {filteredUsers.length === 0 && users.length != 0 ? (
          <p className="col-span-full text-center text-gray-800 text-lg">
            No results for "{search}"
          </p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-gray-400 shadow-md hover:shadow-xl transition rounded-xl p-5 relative flex flex-col gap-2"
            >
              <button
                onClick={() => throttledLikeUser(user._id)}
                className="absolute bottom-3 right-3 flex items-center gap-1 text-pink-600 hover:text-pink-700 transition"
              >
                <Heart size={18}/> <span className="text-sm">{user.likes || 0}</span>
              </button>
              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteUser(user._id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                <Trash size={18} />
              </button>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setEditUser(user)}
                className="absolute top-3.5 right-10 text-blue-600 hover:text-blue-800"
              >
                <Pencil size={16} />
              </button>

              <h2 className="text-lg sm:text-xl font-semibold wrap-break-word">
                {user.name}
              </h2>

              <p className="text-sm wrap-break-word">{user.email}</p>
              <p className="text-sm">Age: {user.age}</p>
              <p className="text-sm">CGPA: {user.cgpa}</p>
              <p className="text-sm wrap-break-word">{user.department}</p>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* ADDRESS */}
              <div className="text-sm mt-2">
                <p>{user.address?.city}</p>
                <p>{user.address?.state}</p>
                <p>{user.address?.zip}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <AddUser
          closeForm={() => setShowForm(false)}
          refreshUsers={fetchUsers}
        />
      )}

      {editUser && (
        <EditUser
          user={editUser}
          closeForm={() => setEditUser(null)}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
}

export default App;
