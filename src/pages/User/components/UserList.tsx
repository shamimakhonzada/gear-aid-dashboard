// import { useNavigate } from "react-router-dom";
// import { MdAdd } from "react-icons/md"; // For a Material Design icon
// import { userUsers } from "../hooks/userHooks";
// import ComponentCard from "../../../components/common/ComponentCard";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";
// import Badge from "../../../components/ui/badge/Badge";

// export default function UserList() {
//   const { users, loading } = userUsers();
//   const navigate = useNavigate();

//   return (
//     <ComponentCard
//       button={
//         <button
//           onClick={() => navigate("/user-form")}
//           className="items-center flex px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <MdAdd /> New
//         </button>
//       }
//     >
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//         {loading ? (
//           <div className="p-4 text-gray-500 dark:text-gray-400">
//             Loading users...
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
//                     User
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
//                     Status
//                   </TableCell>
//                 </TableRow>
//               </TableHeader>

//               {/* Table Body */}
//               <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//                 {users.map((user) => (
//                   <TableRow key={user.id.toString()}>
//                     <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                       {user.id.toString()}
//                     </TableCell>
//                     <TableCell className="px-5 py-4 sm:px-6 text-start">
//                       <div className="flex items-center gap-3">
//                         <div>
//                           <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                             {user.name}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                       {user.email}
//                     </TableCell>

//                     <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                       <Badge color="success" size="sm">
//                         Active
//                       </Badge>
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
import { ref, get, remove } from "firebase/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function UserList() {
  // const { users, loading } = userUsers();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(db, "Users/Service User"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const userList = Object.values(data);
          setUsers(userList);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const navigate = useNavigate();
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      user.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleView = (userId: string) => navigate(`/user/${userId}`);
  const handleDelete = async (userId: string) => {
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
          await remove(ref(db, `Users/Service User/${userId}`));
          setUsers((prev) => prev.filter((user) => user.userId !== userId));

          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          toast.success("User deleted successfully.");
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("Failed to delete user.");
        }
      }
    });
  };
  return (
    <ComponentCard
      title="User Management"
      button={
        <button
          onClick={() => navigate("/user-form")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow"
        >
          <MdAdd className="text-lg" />
          New
        </button>
      }
    >
      {/* Dual Search */}
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
            <p className="mt-3">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <FiSearch className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No users found
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
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Email
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
                {paginatedUsers.map((user) => (
                  <TableRow
                    key={user.userId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <TableCell className="px-6 py-4 text-left text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-full">
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                      <a
                        href={`mailto:${user.email}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        {user.email}
                      </a>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          title="View"
                          onClick={() => handleView(user.userId)}
                          className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => navigate(`/user-form/${user.userId}`)}
                          className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(user.userId)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-0">
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredUsers.length
                  )}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}{" "}
                  of {filteredUsers.length} users
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      currentPage === 1
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2)
                    )
                    .map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`w-10 h-10 rounded-lg border text-sm ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}

                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      currentPage === totalPages
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
