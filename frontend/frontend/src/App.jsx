import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import AddUser from "./AddUser";

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaPlus />
        </button>
      </div>

      {/* USER LIST */}
      <div className="grid gap-6 max-w-2xl mx-auto">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold">{user.name}</h2>

            <p>{user.email}</p>
            <p>{user.age}</p>
            <p>{user.cgpa}</p>
            <p>{user.department}</p>

            {/* Skills */}
            <div className="mt-3">
              {user.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 px-2 py-1 rounded mr-2 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Address */}
            <div className="mt-3">
              <p>{user.address?.city}</p>
              <p>{user.address?.state}</p>
              <p>{user.address?.zip}</p>
            </div>
          </div>
        ))}
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
