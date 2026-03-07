import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Trash } from "lucide-react";
import AddUser from "./AddUser";

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
      const response = await fetch(`http://localhost:3000/users/${id}`, {
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
      user.department.toLowerCase().includes(search.toLowerCase()),
  );

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

      <div className="max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Search name, email, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-amber-50 rounded-lg p-3 bg-gray-400"
        />
      </div>

      {/* USER LIST */}
      <div className="max-w-7xl mx-auto grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] justify-start">
        {filteredUsers.length === 0 ? (
          <p className="col-span-full text-center text-gray-800 text-lg">
            No results for "{search}"
          </p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-gray-400 shadow-md hover:shadow-xl transition rounded-xl p-5 relative flex flex-col gap-2"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteUser(user._id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-600"
              >
                <Trash size={18} />
              </button>

              <h2 className="text-lg sm:text-xl font-semibold break-words">
                {user.name}
              </h2>

              <p className="text-sm break-words">{user.email}</p>
              <p className="text-sm">Age: {user.age}</p>
              <p className="text-sm">CGPA: {user.cgpa}</p>
              <p className="text-sm break-words">{user.department}</p>

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
    </div>
  );
}

export default App;
