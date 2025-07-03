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
  MdStar,
  MdBuild,
  MdAccessTime,
  MdMoney,
  MdLocationOff,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import ComponentCard from "../../../components/common/ComponentCard";

export default function MechanicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMechanic() {
      try {
        const snapshot = await get(ref(db, `Users/Mechanic/${id}`));
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Compute average rating
          let totalRating = 0;
          let count = 0;
          if (data.Reviews) {
            Object.values(data.Reviews).forEach((review: any) => {
              if (review.rating) {
                totalRating += review.rating;
                count++;
              }
            });
          }

          const averageRating = count > 0 ? totalRating / count : null;

          setMechanic({ ...data, averageRating });
        }
      } catch (error) {
        console.error("Error fetching mechanic:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMechanic();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading mechanic details...
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-400 shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
            <MdLocationOff className="text-3xl text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">
            Mechanic Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            The mechanic you are looking for does not exist or may have been
            removed. Please check the URL or return to the mechanic list.
          </p>
          <button
            onClick={() => navigate("/mechanic-tables")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <MdArrowBack className="text-lg" />
            Back to Mechanics
          </button>
        </div>
      </div>
    );
  }

  return (
    <ComponentCard
      title="Mechanic Details"
      button={
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <MdArrowBack /> Back to List
        </button>
      }
    >
      {/* Profile */}
      <div className="flex items-center gap-5 mb-6">
        {mechanic.profilePicUrl ? (
          <img
            src={mechanic.profilePicUrl}
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
            {mechanic.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mechanic.email}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <DetailRow icon={<MdPhone />} label="Phone" value={mechanic.phone} />
        <DetailRow icon={<MdWc />} label="Gender" value={mechanic.gender} />
        <DetailRow
          icon={<MdLocationCity />}
          label="City"
          value={mechanic.city}
        />
        <DetailRow
          icon={<MdLocationOn />}
          label="Address"
          value={mechanic.address}
        />
        <DetailRow
          icon={<MdCreditCard />}
          label="CNIC"
          value={mechanic.idNumber}
        />

        {/* Mechanic Extra Details */}
        <DetailRow
          icon={<MdBuild />}
          label="Service"
          value={mechanic.Details?.service}
        />
        <DetailRow
          icon={<MdAccessTime />}
          label="Timings"
          value={
            mechanic.Details?.timeFrom && mechanic.Details?.timeTo
              ? `${mechanic.Details.timeFrom} - ${mechanic.Details.timeTo}`
              : "—"
          }
        />
        <DetailRow
          icon={<MdMoney />}
          label="Price Range"
          value={mechanic.Details?.pricerange}
        />
        <DetailRow
          icon={<MdStar />}
          label="Experience"
          value={
            mechanic.Details?.yearOfExperience
              ? `${mechanic.Details.yearOfExperience} years`
              : "—"
          }
        />
        <DetailRow
          icon={<MdStar />}
          label="Average Rating"
          value={
            mechanic.averageRating !== null
              ? `⭐ ${mechanic.averageRating.toFixed(1)}`
              : "No Ratings"
          }
        />
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
