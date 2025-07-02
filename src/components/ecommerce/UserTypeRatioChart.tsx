import { useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { UserTypeRatioStore } from "../stores/analyticsStore";

export default function UserTypeRatioChart() {
  const { serviceUsers, serviceProviders, loading, fetchRatio } =
    UserTypeRatioStore();

  useEffect(() => {
    fetchRatio();
  }, []);

  const totalUsers = Math.max(serviceUsers + serviceProviders, 1);
  const serviceUserPercentage = Math.round((serviceUsers / totalUsers) * 100);
  const serviceProviderPercentage = Math.round(
    (serviceProviders / totalUsers) * 100
  );

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 330,
      fontFamily: "Outfit, sans-serif",
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        dataLabels: {
          name: {
            show: true,
            fontSize: "14px",
            color: "#9CA3AF",
          },
          value: {
            show: true,
            fontSize: "28px",
            fontWeight: 700,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ["#6366F1", "#F59E0B"],
    labels: ["Service Users", "Service Providers"],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      labels: {
        colors: "#6B7280",
      },
    },
  };

  const series = [serviceUserPercentage, serviceProviderPercentage];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 shadow-md transition-all duration-300">
      <div className="px-5 pt-6 sm:px-6 sm:pt-7 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            User Distribution
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ratio of service users and providers
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 pt-4 sm:px-6">
        {loading ? (
          <div className="h-[330px] flex items-center justify-center text-gray-400 animate-pulse">
            Loading chart...
          </div>
        ) : (
          <Chart
            options={options}
            series={series}
            type="radialBar"
            height={330}
            className="mx-auto"
          />
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-center text-gray-600 dark:text-gray-300">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Service Users
            </p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {serviceUsers} ({serviceUserPercentage}%)
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Service Providers
            </p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {serviceProviders} ({serviceProviderPercentage}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
