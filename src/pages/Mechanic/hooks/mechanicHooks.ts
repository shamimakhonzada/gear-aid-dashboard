import { useEffect } from "react";
import { MechanicStore } from "../store/mechanicStore";

export const mechanicHooks = () => {
  const {
    mechanics,
    loading,
    fetchMechanics,
    createMechanic,
    updateMechanic,
    deleteMechanic,
  } = MechanicStore();

  useEffect(() => {
    fetchMechanics();
  }, []);

  return { mechanics, loading, updateMechanic, deleteMechanic, createMechanic };
};
