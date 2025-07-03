import { useEffect } from "react";
import { UserStore } from "../store/userStore";

export const userUsers = () => {
  const { users, loading, fetchUsers } = UserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading };
};
