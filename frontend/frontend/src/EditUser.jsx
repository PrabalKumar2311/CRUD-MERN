import { useState } from "react";

function EditUser({ user, closeForm, refreshUsers }) {

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const form = new FormData(e.target);

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      age: Number(form.get("age")),
      cgpa: Number(form.get("cgpa")),
      department: form.get("department"),
      skills: form.get("skills").split(",").map(s => s.trim()),
      address: {
        city: form.get("city"),
        state: form.get("state"),
        zip: form.get("zip")
      }
    };

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/user/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        setFormError("Failed to update user");
        return;
      }

      refreshUsers();
      closeForm();

    } catch (error) {

      console.error(error);
      setFormError("Server error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-105 rounded-2xl shadow-2xl p-8 space-y-4"
      >

        <h2 className="text-2xl font-semibold text-gray-800">
          Edit User
        </h2>

        <input
          defaultValue={user.name}
          name="name"
          className="border rounded-lg p-3 w-full"
        />

        <input
          defaultValue={user.email}
          name="email"
          className="border rounded-lg p-3 w-full"
        />

        <input
          defaultValue={user.age}
          name="age"
          type="number"
          className="border rounded-lg p-3 w-full"
        />

        <input
          defaultValue={user.cgpa}
          name="cgpa"
          type="number"
          step="0.1"
          className="border rounded-lg p-3 w-full"
        />

        <input
          defaultValue={user.department}
          name="department"
          className="border rounded-lg p-3 w-full"
        />

        <input
          defaultValue={user.skills?.join(", ")}
          name="skills"
          className="border rounded-lg p-3 w-full"
        />

        <div className="grid grid-cols-3 gap-2">

          <input
            defaultValue={user.address?.city}
            name="city"
            className="border rounded-lg p-2"
          />

          <input
            defaultValue={user.address?.state}
            name="state"
            className="border rounded-lg p-2"
          />

          <input
            defaultValue={user.address?.zip}
            name="zip"
            className="border rounded-lg p-2"
          />

        </div>

        {formError && (
          <p className="text-red-600 text-sm">
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditUser;