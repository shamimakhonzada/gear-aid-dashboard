// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserStore } from "../store/userStore";
// import ComponentCard from "../../../components/common/ComponentCard";
// import Label from "../../../components/form/Label";
// import Input from "../../../components/form/input/InputField";
// import { EnvelopeIcon } from "../../../icons";

// export default function UserForm() {
//   const navigate = useNavigate();
//   const { addUser } = UserStore();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const countries = [
//     { code: "US", label: "+1" },
//     { code: "PK", label: "+92" },
//     { code: "IN", label: "+91" },
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await addUser({ name, email });
//     navigate("/user-tables"); // redirect to table page
//   };

//   //   const [phone, setPhone] = useState("");

//   // setPhone is already provided by useState above

//   return (
//     <ComponentCard title="Add New User">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Name */}
//         <div>
//           <Label>Name</Label>
//           <Input
//             placeholder="John Doe"
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <Label>Email</Label>
//           <div className="relative">
//             <Input
//               placeholder="info@gmail.com"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="pl-[62px]"
//             />
//             <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
//               <EnvelopeIcon className="size-6" />
//             </span>
//           </div>
//         </div>

//         {/* Phone */}
//         {/* <div>
//           <Label>Phone</Label>
//           <PhoneInput
//             countries={countries}
//             placeholder="+1 (555) 000-0000"
//             onChange={(val: string) => setPhone(val)}
//           />
//         </div> */}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Create User
//         </button>
//       </form>
//     </ComponentCard>
//   );
// }

//firebase

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, ref, set, update } from "firebase/database";
import { db } from "../../../firebase";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { EnvelopeIcon } from "../../../icons";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    address: "",
    idNumber: "",
    createdAt: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        const snapshot = await get(ref(db, `Users/Service User/${id}`));
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          toast.error("User not found.");
          navigate("/user-tables");
        }
      };
      fetchUser();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();

    const finalUser = {
      ...user,
      userId: id || uuidv4(),
      createdAt: isEditMode ? user.createdAt : now,
    };

    try {
      if (isEditMode) {
        await update(ref(db, `Users/Service User/${id}`), finalUser);
        toast.success("User updated successfully.");
      } else {
        // Check if email already exists
        const snapshot = await get(ref(db, "Users/Service User"));
        const existingUsers = snapshot.exists()
          ? Object.values(snapshot.val())
          : [];

        const emailExists = existingUsers.some(
          (u: any) => u.email.toLowerCase() === finalUser.email.toLowerCase()
        );

        if (emailExists) {
          toast.error("A user with this email already exists.");
          return;
        }

        await set(ref(db, `Users/Service User/${finalUser.userId}`), finalUser);
        toast.success("User added successfully.");
      }

      navigate("/user-tables");
    } catch (err) {
      console.error("Error submitting user:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <ComponentCard title={isEditMode ? "Edit User" : "Add New User"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            type="text"
            placeholder="John Doe"
            value={user.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              name="email"
              type="email"
              placeholder="info@example.com"
              value={user.email}
              onChange={handleChange}
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon className="size-6" />
            </span>
          </div>
        </div>

        {/* Phone */}
        <div>
          <Label>Phone</Label>
          <Input
            name="phone"
            type="text"
            placeholder="+92xxxxxxxxxx"
            value={user.phone}
            onChange={handleChange}
          />
        </div>

        {/* Gender */}
        <div>
          <Label>Gender</Label>
          <select
            name="gender"
            value={user.gender}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* City */}
        <div>
          <Label>City</Label>
          <Input
            name="city"
            type="text"
            placeholder="Lahore"
            value={user.city}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          <Input
            name="address"
            type="text"
            placeholder="123 Street, Area, City"
            value={user.address}
            onChange={handleChange}
          />
        </div>

        {/* CNIC */}
        <div>
          <Label>CNIC</Label>
          <Input
            name="idNumber"
            type="text"
            placeholder="12345-1234567-1"
            value={user.idNumber}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update User" : "Create User"}
        </button>
      </form>
    </ComponentCard>
  );
}
