import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UserTables from "./pages/User/page/BasicTables";
import UserForm from "./pages/User/components/UserForm";
import MechanicTables from "./pages/Mechanic/Mechanic";
import MechanicForm from "./pages/Mechanic/components/MechanicForm";
import UserDetail from "./pages/User/components/UserDetail";
import UserList from "./pages/User/components/UserList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MechanicDetail from "./pages/Mechanic/components/MechanicDetail";
import ChatDetail from "./components/chats/ChatDetail";
import ChatsTables from "./pages/Chats/Chat";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <ToastContainer position="bottom-center" autoClose={3000} />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            {/* User Tables */}
            <Route path="/user-tables" element={<UserTables />} />
            <Route path="/user-form" element={<UserForm />} />
            <Route path="/user-form/:id" element={<UserForm />} />

            {/* firebase */}

            <Route path="/user" element={<UserList />} />
            <Route path="/user/:id" element={<UserDetail />} />
            <Route path="/mechanic/:id" element={<MechanicDetail />} />

            {/* Mechanic Tables */}
            <Route path="/mechanic-tables" element={<MechanicTables />} />
            <Route path="/mechanic-form" element={<MechanicForm />} />
            <Route path="/mechanic-form/:id" element={<MechanicForm />} />

            {/* Chats Tables */}
            <Route path="/chat-tables" element={<ChatsTables />} />
            <Route
              path="/admin/chat/:mechanicId/:userId"
              element={<ChatDetail />}
            />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
