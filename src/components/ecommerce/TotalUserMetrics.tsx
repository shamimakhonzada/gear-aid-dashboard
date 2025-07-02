import { ArrowDownIcon, ArrowUpIcon, UserIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { userUsers } from "../../pages/User/hooks/userHooks";
import { MdConstruction } from "react-icons/md";
import { mechanicHooks } from "../../pages/Mechanic/hooks/mechanicHooks";

export default function TotalUserMetrics() {
  const { users, loading } = userUsers();
  const { mechanics } = mechanicHooks();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Customers Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <UserIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Service Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "Loading..." : users.length}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* <!-- Customers Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <MdConstruction className="text-gray-800 size-6 dark:text-white/90" />
          </div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Service Providers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "Loading..." : mechanics.length}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon />
            4.01%
          </Badge>
        </div>
      </div>
    </div>
  );
}
