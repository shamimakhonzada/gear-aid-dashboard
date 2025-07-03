// import { useEffect } from "react";
// import { MechanicStore } from "../store/mechanicStore";

// export const mechanicHooks = () => {
//   const {
//     mechanics,
//     loading,
//     fetchMechanics,
//     createMechanic,
//     updateMechanic,
//     deleteMechanic,
//   } = MechanicStore();

//   useEffect(() => {
//     fetchMechanics();
//   }, []);

//   return { mechanics, loading, updateMechanic, deleteMechanic, createMechanic };
// };


//firebase

// src/pages/mechanic/hooks/mechanicHooks.ts
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";

export const mechanicHooks = () => {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const mechanicRef = ref(db, "Users/Mechanic");

    const unsubscribe = onValue(mechanicRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];

      for (const id in data) {
        list.push({ id, ...data[id] });
      }

      setMechanics(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteMechanic = async (id: string) => {
    const db = getDatabase();
    await remove(ref(db, `Users/Mechanic/${id}`));
  };

  return {
    mechanics,
    loading,
    deleteMechanic,
  };
};
