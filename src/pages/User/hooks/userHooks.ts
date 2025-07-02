import { useEffect } from "react";
import { useUserStore } from "../store/userStore";

export const userUsers = () => {
  const { users, loading, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading };
};
