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
import "./SidebarManagement.css";

const icons = [
  { label: "Retornar", icon: <ArrowLeft size={25} />, path: "/" },
  { label: "Dashboard", icon: <ClipboardList size={25} />, path: "/dashboard" },
  { label: "Gerenciar Usuários", icon: <User size={25} />, path: "/UserManagement" },
  { label: "Preferências", icon: <Settings size={25} />, path: "/configuracoes" },
];

const SidebarManagement = () => {
  const location = useLocation();

  return (
    <motion.div
      className="sidebar-management"
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

export default SidebarManagement;
