import React from "react";
import Logo from "../../img/logo.png";
import DashboardIcon from "../../img/dashboard.png";
import DashboardGray from "../../img/dashboard-gray.png";
import SidebarBtn from "./sidebarbutton";
import TasksIcon from "../../img/tasks.png";
import TasksIconGray from "../../img/tasks-gray.png";
import CompleteIcon from "../../img/completed.png";
import CompleteIconGray from "../../img/completed-gray.png";
import Profile from "../../img/profile.png";
import ProfileGray from "../../img/profile-gray.png";
import Stats from "../../img/stats.png";
import StatsGray from "../../img/stat-gray.png";
import LogOut from "../../img/logout.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import CloseIcon from "../../img/closebutton.png";

function MobileSidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((error) => console.error("Error logging out:", error));
  };

  return (
    <div className={`MobileSidebar ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="SidebarHeader">
        <div className="SidebarLogo">
          <img src={Logo} alt="Foculy Logo" />
        </div>
        <button className="CloseButton" onClick={toggleSidebar}>
          <img src={CloseIcon} alt="Close Sidebar" />
        </button>
      </div>

      <div className="SidebarContent">
        <SidebarBtn
          isActive={location.pathname === "/dashboard"}
          Icon={DashboardIcon}
          GrayIcon={DashboardGray}
          URI="/dashboard"
          Text="Dashboard"
        />

        <SidebarBtn
          isActive={/^\/dashboard\/tasks(\/.*)?$/.test(location.pathname)}
          Icon={TasksIcon}
          GrayIcon={TasksIconGray}
          URI="/dashboard/tasks"
          Text="My Tasks"
        />

        <SidebarBtn
          isActive={location.pathname === "/dashboard/completed"}
          Icon={CompleteIcon}
          GrayIcon={CompleteIconGray}
          URI="/dashboard/completed"
          Text="Completed"
        />

        <SidebarBtn
          isActive={location.pathname === "/dashboard/profile"}
          Icon={Profile}
          GrayIcon={ProfileGray}
          URI="/dashboard/profile"
          Text="Profile"
        />

        <SidebarBtn
          isActive={location.pathname === "/dashboard/stats"}
          Icon={Stats}
          GrayIcon={StatsGray}
          URI="/dashboard/stats"
          Text="Statistics"
        />
      </div>

      <Link
        to="/"
        className="SidebarButton Active logout"
        onClick={handleLogout}
      >
        <img src={LogOut} alt="Logout" /> Logout
      </Link>
    </div>
  );
}

export default MobileSidebar;
