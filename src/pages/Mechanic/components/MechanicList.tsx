import { useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md"; // For a Material Design icon
import ComponentCard from "../../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { mechanicHooks } from "../hooks/mechanicHooks";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../../icons";

export default function MechanicList() {
  const { mechanics, loading, deleteMechanic } = mechanicHooks();
  const navigate = useNavigate();

  const handleView = (id: number) => {
    console.log("View mechanic with ID:", id);
    navigate(`/mechanic-view/${id}`);
  };

  const handleEdit = async (id: number) => {
    console.log("Edit mechanic with ID:", id);
    navigate(`/mechanic-form/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this mechanic?")) {
      await deleteMechanic(id);
    }
  };

  return (
    <ComponentCard
      title="Service Providers"
      button={
        <button
          onClick={() => navigate("/mechanic-form")}
          className="items-center flex px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MdAdd /> New
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {loading ? (
          <div className="p-4 text-gray-500 dark:text-gray-400">
            Loading service providers...
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
                    Name
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
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {mechanics.map((mechanic) => (
                  <TableRow key={mechanic.id.toString()}>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {mechanic.id.toString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {mechanic.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {mechanic.email}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {mechanic.phone}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleView(mechanic.id)}
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(mechanic.id)}
                          className="text-amber-500 hover:text-amber-700 transition"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(mechanic.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
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
