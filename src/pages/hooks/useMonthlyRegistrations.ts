// import { useEffect, useState } from "react";
// import { getMonthlyData } from "../../utils/firebaseStats";

// interface MonthlyData {
//   users: number[];
//   mechanics: number[];
// }

// export function useMonthlyRegistrations() {
//   const [data, setData] = useState<MonthlyData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadMonthly() {
//       setLoading(true);
//       const result = await getMonthlyData();
//       setData({
//         users: result.serviceUserMonthly,
//         mechanics: result.mechanicMonthly,
//       });
//       setLoading(false);
//     }

//     loadMonthly();
//   }, []);

//   return { data, loading };
// }

// second

import { useEffect, useState } from "react";
import { getYearlyMonthlyData } from "../../utils/firebaseStats";

interface MonthlyData {
  [year: string]: {
    users: number[];
    mechanics: number[];
  };
}

export function useMonthlyRegistrations() {
  const [data, setData] = useState<MonthlyData>({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    async function loadMonthly() {
      setLoading(true);
      const result = await getYearlyMonthlyData();

      // Reformat for easier consumption in components
      const formatted: MonthlyData = {};
      Object.entries(result).forEach(([year, values]) => {
        formatted[year] = {
          users: values.serviceUsers,
          mechanics: values.mechanics,
        };
      });

      setData(formatted);

      // Select latest year by default
      const latestYear = Object.keys(formatted).sort().reverse()[0];
      setSelectedYear(latestYear);

      setLoading(false);
    }

    loadMonthly();
  }, []);

  return {
    data,
    loading,
    selectedYear,
    setSelectedYear,
    availableYears: Object.keys(data).sort().reverse(),
  };
}
