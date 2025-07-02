import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/dashboard" className="sidebar-option">
          <RiDashboardLine className="icon" />
          <p>Dashboard</p>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <FaCirclePlus className="icon" />
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/list" className="sidebar-option">
          <FaUtensils className="icon" />
          <p>List Items</p>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option">
          <MdOutlineDeliveryDining className="icon" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
