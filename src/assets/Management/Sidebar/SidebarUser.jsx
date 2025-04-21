import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip,tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowLeft} from "lucide-react";
import "./SidebarUser.css";


const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#9b9b9b", // mesmo tom do hover
    color: "#fefefe",
    fontSize: "12px",
    borderRadius: "10px",
    padding: "6px 10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    fontWeight: 500,
    letterSpacing: 0.2,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#9b9b9b",
  },
}));

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
          <CustomTooltip title={label} placement="right" arrow key={label}>
            <Link to={path} className="sidebar-link">
              <motion.div
                className={`sidebar-icon-wrapper ${isActive ? "active" : ""}`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {icon}
              </motion.div>
            </Link>
            </CustomTooltip>
        );
      })}
    </motion.div>
  );
};

export default SidebarUser;
