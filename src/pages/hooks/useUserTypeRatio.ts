import { useEffect, useState } from "react";
import { getUserTypeRatio } from "../../utils/firebaseStats";

export function useUserTypeRatio() {
  const [serviceUsers, setServiceUsers] = useState(0);
  const [mechanics, setMechanics] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { serviceUsers, mechanics } = await getUserTypeRatio();
      setServiceUsers(serviceUsers);
      setMechanics(mechanics);
      setLoading(false);
    }
    load();
  }, []);

  return { serviceUsers, serviceProviders: mechanics, loading };
}
