import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserList from "../components/UserList";


export default function UserTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <UserList />
      </div>
    </>
  );
}
