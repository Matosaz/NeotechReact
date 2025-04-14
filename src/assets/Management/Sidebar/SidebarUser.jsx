import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  ClipboardList,
  ArrowLeft
} from "lucide-react";
import "./SidebarUser.css";

const icons = [
  { label: "Retornar", icon: <ArrowLeft size={25} />, path: "/" },
];

const SidebarUser = () => {
  const location = useLocation();

  return (
    <motion.div
      className="sidebar-user"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {icons.map(({ label, icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <Tooltip title={label} placement="right" arrow key={label}>
            <Link to={path} className="sidebar-link">
              <motion.div
                className={`sidebar-icon-wrapper ${isActive ? "active" : ""}`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {icon}
              </motion.div>
            </Link>
          </Tooltip>
        );
      })}
    </motion.div>
  );
};

export default SidebarUser;
