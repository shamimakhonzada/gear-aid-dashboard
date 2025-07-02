import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { EnvelopeIcon } from "../../../icons";


export default function UserForm() {
  const navigate = useNavigate();
  const { addUser } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const countries = [
    { code: "US", label: "+1" },
    { code: "PK", label: "+92" },
    { code: "IN", label: "+91" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser({ name, email });
    navigate("/user-tables"); // redirect to table page
  };

  //   const [phone, setPhone] = useState("");

  // setPhone is already provided by useState above

  return (
    <ComponentCard title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon className="size-6" />
            </span>
          </div>
        </div>

        {/* Phone */}
        {/* <div>
          <Label>Phone</Label>
          <PhoneInput
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={(val: string) => setPhone(val)}
          />
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </ComponentCard>
  );
}
