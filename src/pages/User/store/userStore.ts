import { create } from "zustand";
import { User } from "../types/userTypes";
import { createUser, fetchAllUsers } from "../api/userApi";

interface UserState {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (newUser: Omit<User, "id" | "createdAt">) => Promise<void>;
}

export const UserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const data = await fetchAllUsers();
      set({ users: data });
    } catch (error: any) {
      console.error("Error fetching users:", error?.message || error);
    } finally {
      set({ loading: false });
    }
  },

  addUser: async (newUser) => {
    try {
      await createUser(newUser);
      const updatedUsers = await fetchAllUsers();
      set({ users: updatedUsers });
    } catch (error) {
      console.error("Error adding user", error);
    }
  },
}));
