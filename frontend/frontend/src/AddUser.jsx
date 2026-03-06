import { useState } from "react";

function AddUser({ closeForm, refreshUsers }) {

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const form = new FormData(e.target);

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      age: form.get("age"),
      cgpa: form.get("cgpa"),
      department: form.get("department"),
      enrolled: true,
      skills: form.get("skills"),
      address: {
        city: form.get("city"),
        state: form.get("state"),
        zip: form.get("zip")
      }
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.age ||
      !payload.cgpa ||
      !payload.department ||
      !payload.skills ||
      !payload.address.city ||
      !payload.address.state ||
      !payload.address.zip
    ) {
      setFormError("Please fill in all the fields");
      return;
    }

    payload.skills = payload.skills.split(",").map(s => s.trim());
    payload.age = Number(payload.age);
    payload.cgpa = Number(payload.cgpa);

    try {

      setLoading(true);
      setFormError("");

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setFormError("Failed to create user");
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
        className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 space-y-4"
      >

        <h2 className="text-2xl font-semibold text-gray-800">
          Add User
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="number"
          step="0.1"
          name="cgpa"
          placeholder="CGPA"
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          className="border rounded-lg p-3 w-full"
        />

        <div className="grid grid-cols-3 gap-2">

          <input
            type="text"
            name="city"
            placeholder="City"
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            name="zip"
            placeholder="Zip"
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
            {loading ? "Adding..." : "Add User"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddUser;