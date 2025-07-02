import { useEffect, useState } from "react";
import {
  fetchMonthlyRegistrations,
  fetchUserTypeRatio,
} from "../api/analyticsApi";
import { create } from "zustand";

// ================================
// Monthly Registrations Hook
// ================================

export function useMonthlyRegistrations() {
  const [data, setData] = useState<{
    users: number[];
    mechanics: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetchMonthlyRegistrations();
      setData(res);
      setLoading(false);
    }
    load();
  }, []);

  return { data, loading };
}

// ================================
// User Type Ratio Zustand Store
// ================================

interface UserTypeState {
  serviceUsers: number;
  serviceProviders: number;
  loading: boolean;
  fetchRatio: () => Promise<void>;
}

export const UserTypeRatioStore = create<UserTypeState>((set) => ({
  serviceUsers: 0,
  serviceProviders: 0,
  loading: false,

  fetchRatio: async () => {
    set({ loading: true });
    try {
      const data = await fetchUserTypeRatio();
      set({
        serviceUsers: data.serviceUsers,
        serviceProviders: data.serviceProviders,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching user ratio:", error);
      set({ loading: false });
    }
  },
}));
