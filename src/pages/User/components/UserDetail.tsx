import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { get, ref } from "firebase/database";
import {
  MdArrowBack,
  MdPhone,
  MdLocationCity,
  MdLocationOn,
  MdWc,
  MdCreditCard,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import ComponentCard from "../../../components/common/ComponentCard";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const snapshot = await get(ref(db, `Users/Service User/${id}`));
      setUser(snapshot.val());
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        User not found.
      </div>
    );
  }

  return (
    <ComponentCard
      title="User Details"
      button={
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <MdArrowBack /> Back to List
          </button>
        </div>
      }
    >
      {/* Profile Section */}
      <div className="flex items-center gap-5 mb-6">
        {user.profilePicUrl ? (
          <img
            src={user.profilePicUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-white/10"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/80";
            }}
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
            <FaUserCircle className="text-4xl text-gray-500 dark:text-gray-300" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <DetailRow icon={<MdPhone />} label="Phone" value={user.phone} />
        <DetailRow icon={<MdWc />} label="Gender" value={user.gender} />
        <DetailRow icon={<MdLocationCity />} label="City" value={user.city} />
        <DetailRow
          icon={<MdLocationOn />}
          label="Address"
          value={user.address}
        />
        <DetailRow icon={<MdCreditCard />} label="CNIC" value={user.idNumber} />
      </div>
    </ComponentCard>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-xl text-gray-400 dark:text-gray-500 mt-1">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="font-semibold text-gray-800 dark:text-white">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
