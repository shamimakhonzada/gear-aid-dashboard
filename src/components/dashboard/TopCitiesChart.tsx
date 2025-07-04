import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getDatabase, ref, get } from "firebase/database";
import { ApexOptions } from "apexcharts";

type CityData = Record<string, { users: number; mechanics: number }>;

export default function TopCitiesChart() {
  const [cityLabels, setCityLabels] = useState<string[]>([]);
  const [userCounts, setUserCounts] = useState<number[]>([]);
  const [mechanicCounts, setMechanicCounts] = useState<number[]>([]);

  useEffect(() => {
    const fetchCityData = async () => {
      const db = getDatabase();
      const [userSnap, mechanicSnap] = await Promise.all([
        get(ref(db, "Users/Service User")),
        get(ref(db, "Users/Mechanic")),
      ]);

      const users = userSnap.val() || {};
      const mechanics = mechanicSnap.val() || {};

      const cityData: CityData = {};

      const normalizeCity = (city: string) => city.trim().toLowerCase();

      const toTitleCase = (str: string) =>
        str.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );

      const addToCityData = (data: any, role: "users" | "mechanics") => {
        Object.values(data).forEach((entry: any) => {
          const cityRaw = entry.city;
          if (!cityRaw) return;
          const cityKey = normalizeCity(cityRaw);
          if (!cityData[cityKey]) {
            cityData[cityKey] = { users: 0, mechanics: 0 };
          }
          cityData[cityKey][role]++;
        });
      };

      addToCityData(users, "users");
      addToCityData(mechanics, "mechanics");

      const sorted = Object.entries(cityData)
        .sort(([, a], [, b]) => b.users + b.mechanics - (a.users + a.mechanics))
        .slice(0, 5);

      setCityLabels(sorted.map(([city]) => toTitleCase(city)));
      setUserCounts(sorted.map(([, count]) => count.users));
      setMechanicCounts(sorted.map(([, count]) => count.mechanics));
    };

    fetchCityData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        columnWidth: "50%",
      },
    },
    colors: ["#3b82f6", "#10b981"], // blue & green
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: cityLabels,
      labels: {
        style: {
          fontSize: "13px",
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} users`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: "#6B7280",
      },
    },
    grid: {
      borderColor: "#E5E7EB",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "65%",
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Service Users",
      data: userCounts,
    },
    {
      name: "Mechanics",
      data: mechanicCounts,
    },
  ];

  const exportCSV = () => {
    const headers = ["City", "Service Users", "Mechanics"];
    const rows = cityLabels.map((city, i) => [
      city,
      userCounts[i],
      mechanicCounts[i],
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "top_cities_chart.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="mb-6">
        <div className="flex  justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Top Cities by User Count
          </h3>
          <button
            onClick={exportCSV}
            className=" px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Based on combined Service Users and Mechanics
        </p>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={300} />
        </div>
      </div>
    </div>
  );
}
