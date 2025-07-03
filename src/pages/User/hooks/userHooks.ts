// import { useEffect } from "react";
// import { UserStore } from "../store/userStore";

// export const userUsers = () => {
//   const { users, loading, fetchUsers } = UserStore();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return { users, loading };
// };


import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ref, get } from "firebase/database";

interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  city: string;
  address: string;
  idNumber: string;
  [key: string]: any;
}

export function userUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const snapshot = await get(ref(db, "Users/Service User"));
      const data = snapshot.val();
      if (data) {
        const parsedUsers = Object.entries(data).map(([userId, details]) => ({
          userId,
          ...(details as any),
        }));
        setUsers(parsedUsers);
      } else {
        setUsers([]);
      }
      setLoading(false);
    }

    fetchUsers();
  }, []);

  return { users, loading };
}
