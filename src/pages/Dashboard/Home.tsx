import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import TotalUserMetrics from "../../components/ecommerce/TotalUserMetrics";
import UserTypeRatioChart from "../../components/ecommerce/UserTypeRatioChart";
import MonthlyRegistrationChart from "../../components/ecommerce/MonthlyRegistrationChart";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <TotalUserMetrics />
          <MonthlyRegistrationChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <UserTypeRatioChart />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
