import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-[100vh] p-1 ">
        <div className="w-full bg-[#3351A7] flex justify-center text-white  tracking-wider">
          <h1 className="uppercase font-thin">
            handball <span className="font-bold">DATA CONTROL</span>
          </h1>
        </div>
      <div className="w-full flex">
      <Sidebar />
        <div className=" w-full">
        <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
