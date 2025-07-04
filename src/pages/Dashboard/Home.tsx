import StatisticsChart from "../../components/dashboard/StatisticsChart";
import TotalUserMetrics from "../../components/dashboard/TotalUserMetrics";
import UserTypeRatioChart from "../../components/dashboard/UserTypeRatioChart";
import MonthlyRegistrationChart from "../../components/dashboard/MonthlyRegistrationChart";
import TopCitiesChart from "../../components/dashboard/TopCitiesChart";
import MechanicRatingChart from "../../components/dashboard/MechanicRatingChart";

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
          {/* <DemographicCard /> */}
          <TopCitiesChart/>
           
        </div>

        <div className="col-span-12 xl:col-span-7">
          {/* <RecentOrders /> */}
          
          <MechanicRatingChart/>
        </div>
      </div>
    </>
  );
}
