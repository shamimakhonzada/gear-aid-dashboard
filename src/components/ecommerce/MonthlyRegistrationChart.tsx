import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMonthlyRegistrations } from "../stores/analyticsStore";

export default function MonthlyRegistrationChart() {
  const { data, loading } = useMonthlyRegistrations();

  const options: ApexOptions = {
    colors: ["#6366F1", "#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9CA3AF", // Tailwind slate-400
          fontSize: "13px",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontFamily: "Outfit",
      labels: {
        colors: "#4B5563", // Tailwind gray-700
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "13px",
        },
      },
    },
    grid: {
      strokeDashArray: 4,
      borderColor: "#E5E7EB", // Tailwind gray-200
    },
    fill: { opacity: 0.95 },
    tooltip: {
      theme: "light",
      x: { show: true },
      y: {
        formatter: (val: number) => `${val} registrations`,
      },
    },
  };

  const series = [
    {
      name: "Service Users",
      data: data?.users ?? Array(12).fill(0),
    },
    {
      name: "Service Providers",
      data: data?.mechanics ?? Array(12).fill(0),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Monthly Registrations
        </h3>
      </div>

      {/* Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[650px] xl:min-w-full px-5 pb-5 sm:px-6 sm:pb-6">
          {loading ? (
            <div className="h-[220px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Loading chart...
            </div>
          ) : (
            <Chart options={options} series={series} type="bar" height={220} />
          )}
        </div>
      </div>
    </div>
  );
}
