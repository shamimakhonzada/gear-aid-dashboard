import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MechanicServiceChart() {
  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("day");

  const chartData = {
    day: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [{ name: "Completed", data: [3, 2, 4, 1, 5, 4, 3] }],
    },
    week: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      series: [{ name: "Completed", data: [18, 22, 25, 20] }],
    },
    month: {
      categories: ["Apr", "May", "Jun", "Jul"],
      series: [{ name: "Completed", data: [80, 90, 85, 100] }],
    },
  };

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 4,
      colors: ["#ffffff"],
      strokeColors: "#465FFF",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: chartData[activeTab].categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
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
        formatter: (val) => `${val} services`,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Mechanic Service Completion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track how many services are completed
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-xl border bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          {["day", "week", "month"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "day" | "week" | "month")}
              className={`capitalize px-3 py-1.5 text-sm rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-white text-gray-800 shadow dark:bg-white/10 dark:text-white"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart
            options={options}
            series={chartData[activeTab].series}
            type="area"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
