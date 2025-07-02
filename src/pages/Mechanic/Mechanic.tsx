import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import MechanicList from "./components/MechanicList";


export default function MechanicTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
        <MechanicList />
      </div>
    </>
  );
}
