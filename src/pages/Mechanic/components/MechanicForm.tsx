import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, ref, set } from "firebase/database";
import { db } from "../../../firebase";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { toast } from "react-toastify";

export default function MechanicForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    address: "",
    idNumber: "",
    Details: {
      service: "",
      pricerange: "",
      timeFrom: "",
      timeTo: "",
      yearOfExperience: "",
    },
  });

  const [, setServiceOptions] = useState<string[]>([]);

  // Fetch mechanic data (if editing)
  useEffect(() => {
    if (id) {
      const fetchMechanic = async () => {
        try {
          const snapshot = await get(ref(db, `Users/Mechanic/${id}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            setFormData({
              ...data,
              Details: {
                service: data.Details?.service || "",
                pricerange: data.Details?.pricerange || "",
                timeFrom: data.Details?.timeFrom || "",
                timeTo: data.Details?.timeTo || "",
                yearOfExperience: data.Details?.yearOfExperience || "",
              },
            });
          } else {
            toast.error("Mechanic not found.");
          }
        } catch (error) {
          console.error("Failed to fetch mechanic:", error);
        }
      };
      fetchMechanic();
    }
  }, [id]);

  // Fetch service dropdown options
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await get(ref(db, "Users/Mechanic"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const uniqueServices = new Set<string>();

          Object.values<any>(data).forEach((mech) => {
            const service = mech?.Details?.service;
            if (service) uniqueServices.add(service);
          });

          setServiceOptions(Array.from(uniqueServices));
        } else {
          setServiceOptions(defaultServices);
        }
      } catch (err) {
        console.error("Error fetching service options:", err);
        setServiceOptions(defaultServices);
      }
    };

    fetchServices();
  }, []);

  const defaultServices = [
    "Diesel Mechanic",
    "Diagnostic technician",
    "Motor Mechanic",
    "Brake and transmission technician",
    "Bike mechanic",
    "Brake repairers",
    "Changing fuel and air filters",
    "Brake leaks",
    "Change oil filter",
    "Battery testing",
    "Spark plug",
    "Wheel alignment",
    "Lights check",
    "Replace windshield wipers",
    "Brake fluid",
    "Suspension & Steering Systems Inspector",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in formData.Details) {
      setFormData((prev: any) => ({
        ...prev,
        Details: {
          ...prev.Details,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = id || crypto.randomUUID();

    try {
      await set(ref(db, `Users/Mechanic/${userId}`), {
        ...formData,
        userId,
      });
      toast.success(isEdit ? "Mechanic updated!" : "Mechanic added!");
      navigate("/mechanic-tables");
    } catch (error) {
      console.error("Error saving mechanic:", error);
      toast.error("Error saving mechanic.");
    }
  };

  return (
    <ComponentCard title={isEdit ? "Edit Mechanic" : "Add Mechanic"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <Label>City</Label>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>CNIC</Label>
            <Input
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
            />
          </div>

          {/* Mechanic Service Details */}
          <div>
            <Label>Service</Label>
            <select
              name="service"
              value={formData.Details.service}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Service</option>
              {defaultServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Price Range</Label>
            <Input
              name="pricerange"
              value={formData.Details.pricerange}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>From Time</Label>
            <Input
              type="time"
              name="timeFrom"
              value={formData.Details.timeFrom}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>To Time</Label>
            <Input
              type="time"
              name="timeTo"
              value={formData.Details.timeTo}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Experience (Years)</Label>
            <Input
              type="number"
              name="yearOfExperience"
              value={formData.Details.yearOfExperience}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isEdit ? "Update" : "Add"} Mechanic
        </button>
      </form>
    </ComponentCard>
  );
}
