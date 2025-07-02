import { useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md"; // For a Material Design icon
import { userUsers } from "../hooks/userHooks";
import ComponentCard from "../../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";

export default function UserList() {
  const { users, loading } = userUsers();
  const navigate = useNavigate();

  return (
    <ComponentCard
      button={
        <button
          onClick={() => navigate("/user-form")}
          className="items-center flex px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MdAdd /> New
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {loading ? (
          <div className="p-4 text-gray-500 dark:text-gray-400">
            Loading users...
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users.map((user) => (
                  <TableRow key={user.id.toString()}>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.id.toString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge color="success" size="sm">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
