// import { useNavigate } from "react-router-dom";
// import { MdAdd } from "react-icons/md"; // For a Material Design icon
// import ComponentCard from "../../../components/common/ComponentCard";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";
// import { mechanicHooks } from "../hooks/mechanicHooks";
// import { EyeIcon, PencilIcon, TrashBinIcon } from "../../../icons";

// export default function MechanicList() {
//   const { mechanics, loading, deleteMechanic } = mechanicHooks();
//   const navigate = useNavigate();

//   const handleView = (id: number) => {
//     console.log("View mechanic with ID:", id);
//     navigate(`/mechanic-view/${id}`);
//   };

//   const handleEdit = async (id: number) => {
//     console.log("Edit mechanic with ID:", id);
//     navigate(`/mechanic-form/${id}`);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Are you sure you want to delete this mechanic?")) {
//       await deleteMechanic(id);
//     }
//   };

//   return (
//     <ComponentCard
//       title="Service Providers"
//       button={
//         <button
//           onClick={() => navigate("/mechanic-form")}
//           className="items-center flex px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <MdAdd /> New
//         </button>
//       }
//     >
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//         {loading ? (
//           <div className="p-4 text-gray-500 dark:text-gray-400">
//             Loading service providers...
//           </div>
//         ) : (
//           <div className="max-w-full overflow-x-auto">
//             <Table>
//               {/* Table Header */}
//               <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//                 <TableRow>
//                   <TableCell
//                     isHeader
//                     className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                   >
//                     ID
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                   >
//                     Name
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                   >
//                     Email
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                   >
//                     Phone
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                   >
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHeader>

//               {/* Table Body */}
//               <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//                 {mechanics.map((mechanic) => (
//                   <TableRow key={mechanic.id.toString()}>
//                     <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                       {mechanic.id.toString()}
//                     </TableCell>
//                     <TableCell className="px-5 py-4 sm:px-6 text-start">
//                       <div className="flex items-center gap-3">
//                         <div>
//                           <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                             {mechanic.name}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                       {mechanic.email}
//                     </TableCell>

//                     <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                       {mechanic.phone}
//                     </TableCell>

//                     <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
//                       <div className="flex items-center gap-3">
//                         <button
//                           onClick={() => handleView(mechanic.id)}
//                           className="text-blue-500 hover:text-blue-700 transition"
//                         >
//                           <EyeIcon className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(mechanic.id)}
//                           className="text-amber-500 hover:text-amber-700 transition"
//                         >
//                           <PencilIcon className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(mechanic.id)}
//                           className="text-red-500 hover:text-red-700 transition"
//                         >
//                           <TrashBinIcon className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </div>
//     </ComponentCard>
//   );
// }

//firebase

import { useNavigate } from "react-router-dom";
import { MdAdd, MdDelete, MdVisibility, MdEdit } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import ComponentCard from "../../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ref, get, remove } from "firebase/database";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function MechanicList() {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const snapshot = await get(ref(db, "Users/Mechanic"));
        if (snapshot.exists()) {
          const data = snapshot.val();

          const mechanicList = Object.values(data).map((mechanic: any) => {
            let averageRating = null;

            if (mechanic.Reviews) {
              const ratings = Object.values(mechanic.Reviews)
                .map((review: any) => review.rating)
                .filter((rating) => typeof rating === "number" && rating > 0);

              if (ratings.length > 0) {
                const total = ratings.reduce((sum, r) => sum + r, 0);
                averageRating = total / ratings.length;
              }
            }

            return {
              ...mechanic,
              averageRating,
            };
          });

          setMechanics(mechanicList);
          console.log("Mechanics fetched with ratings:", mechanicList);
        } else {
          setMechanics([]);
        }
      } catch (error) {
        console.error("Error fetching mechanics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  console.log("Mechanics from Firebase:", mechanics);

  const filteredMechanics = mechanics.filter(
    (mech) =>
      mech.name?.toLowerCase().includes(nameSearch.toLowerCase()) &&
      mech.email?.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const paginatedMechanics = filteredMechanics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleView = (id: string) => navigate(`/mechanic/${id}`);
  const handleEdit = (id: string) => navigate(`/mechanic-form/${id}`);
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(ref(db, `Users/Mechanic/${id}`));
          setMechanics((prev) => prev.filter((mech) => mech.userId !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Mechanic has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting mechanic:", error);
          toast.error("Failed to delete mechanic.");
        }
      }
    });
  };

  return (
    <ComponentCard
      title="Mechanic Management"
      button={
        <button
          onClick={() => navigate("/mechanic-form")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow"
        >
          <MdAdd className="text-lg" />
          New
        </button>
      }
    >
      {/* Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            value={nameSearch}
            onChange={(e) => {
              setNameSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={emailSearch}
            onChange={(e) => {
              setEmailSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            <div className="inline-block animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-3">Loading mechanics...</p>
          </div>
        ) : filteredMechanics.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <FiSearch className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No mechanics found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="dark:text-white bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Mechanic
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Rating
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMechanics.map((mech) => (
                  <TableRow
                    key={mech.userId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <TableCell className="px-6 py-4 text-left text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-full">
                          {mech.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="font-medium">{mech.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                      <a
                        href={`mailto:${mech.email}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        {mech.email}
                      </a>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                      {mech.averageRating !== null
                        ? `⭐ ${mech.averageRating.toFixed(1)}`
                        : "No Ratings"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          title="View"
                          onClick={() => handleView(mech.userId)}
                          className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => navigate(`/mechanic-form/${mech.userId}`)}

                          className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(mech.userId)}
                          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                        >
                          <MdDelete className="text-xl" />
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
