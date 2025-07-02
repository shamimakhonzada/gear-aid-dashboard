import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import { MechanicStore } from "../store/mechanicStore";

export default function MechanicForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mechanics, createMechanic, updateMechanic, fetchMechanics } =
    MechanicStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchMechanics().then(() => {
        const mechanicToEdit = mechanics.find((m) => m.id === Number(id));
        if (mechanicToEdit) {
          setName(mechanicToEdit.name);
          setEmail(mechanicToEdit.email);
          setPhone(mechanicToEdit.phone);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      await createMechanic({ name, email, phone });
    } else {
      await updateMechanic(Number(id), { name, email, phone });
    }

    navigate("/mechanic-tables");
  };

  return (
    <ComponentCard title={isEditMode ? "Update Mechanic" : "Add New Mechanic"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Email
          </label>
          <input
            type="email"
            placeholder="info@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Phone
          </label>
          <input
            type="tel"
            placeholder="+92-3xx-xxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Mechanic" : "Create Mechanic"}
        </button>
      </form>
    </ComponentCard>
  );
}
