import { create } from "zustand";
import {
  createMechanic,
  fetchAllMechanics,
  updateMechanic,
  deleteMechanic,
} from "../api/mechanicApi";
import { Mechanic } from "../types/mechanicTypes";

interface MechanicState {
  mechanics: Mechanic[];
  loading: boolean;
  fetchMechanics: () => Promise<void>;
  createMechanic: (
    newMechanic: Omit<Mechanic, "id" | "createdAt">
  ) => Promise<void>;
  updateMechanic: (
    id: number,
    updatedData: Omit<Mechanic, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  deleteMechanic: (id: number) => Promise<void>;
}

export const MechanicStore = create<MechanicState>((set) => ({
  mechanics: [],
  loading: false,

  // Fetch All
  fetchMechanics: async () => {
    set({ loading: true });
    try {
      const data = await fetchAllMechanics();
      set({ mechanics: data });
    } catch (error: any) {
      console.error("Error fetching Mechanics", error?.message || error);
    } finally {
      set({ loading: false });
    }
  },

  //  Create
  createMechanic: async (newMechanic) => {
    try {
      await createMechanic(newMechanic);
      const updatedList = await fetchAllMechanics();
      set({ mechanics: updatedList });
    } catch (error) {
      console.error("Error adding mechanic", error);
    }
  },

  //  Update
  updateMechanic: async (id, updatedData) => {
    try {
      await updateMechanic(id, updatedData);
      const updatedList = await fetchAllMechanics();
      set({ mechanics: updatedList });
    } catch (error) {
      console.error("Error updating mechanic", error);
    }
  },

  //  Delete
  deleteMechanic: async (id) => {
    try {
      await deleteMechanic(id);
      const updatedList = await fetchAllMechanics();
      set({ mechanics: updatedList });
    } catch (error) {
      console.error("Error deleting mechanic", error);
    }
  },
}));
