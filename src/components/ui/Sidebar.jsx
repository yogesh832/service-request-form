import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTicketAlt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import '../../../public/images/WhatsApp Image 2025-06-18 at 10.23.20_4395d285.jpg'
const Sidebar = ({ isOpen, toggle }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null;

  // Use consistent base path
  const basePath = "/dashboard";

  const navItems = [
    {
      path: `${basePath}`,
      label: "Dashboard",
      icon: <FaHome />,
      roles: ["client", "admin", "employee"],
    },
    {
      path: `${basePath}/tickets`,
      label: "Tickets",
      icon: <FaTicketAlt />,
      roles: ["client", "admin", "employee"],
    },
    ...(user.role === "admin"
      ? [
          {
            path: `${basePath}/clients`,
            label: "Clients",
            icon: <FaUsers />,
            roles: ["admin"],
          },

        ]
      : []),
    ...(user.role === "client"
      ? [
          {
            path: `${basePath}/client-analytics`,
            label: "Client Analytics",
            icon: <FaChartBar />,
            roles: ["client"],
          },
        ]
      : []),
    {
      path: `${basePath}/analytics`,
      label: "Reports",
      icon: <FaChartBar />,
      roles: ["admin", "employee"],
    },
    // {
    //   path: `${basePath}/settings`,
    //   label: "Settings",
    //   icon: <FaCog />,
    //   roles: ["admin", "employee"],
    // },
    {
      path: `${basePath}/profile`,
      label: "Profile",
      icon: <FaUsers />,
      roles: ["client", "admin", "employee"],
    },
  ];

  // Filter nav items by user role
  const filteredItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside
      className={`
        fixed left-0 z-30 
        bg-gradient-to-b from-blue-900 to-blue-800 text-white 
        w-64 
        transform transition-transform duration-300 ease-in-out

        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0

        top-16 md:top-0 lg:top-0
        h-[calc(100vh-64px)] md:h-full
      `}
    >
      <div className="flex items-center justify-between p-5 border-b border-blue-700">
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-lg">
            {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg"></div> */}
<img
  src="/images/WhatsApp Image 2025-06-18 at 10.23.20_4395d285.jpg"
  alt="Profile"
  className="w-8 h-8 rounded-lg object-contain"
/>


          </div>
          <h1 className="text-xl font-bold">SALKA TECH</h1>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-700 shadow-inner"
                      : "hover:bg-blue-700/50"
                  }`
                }
                onClick={toggle}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-blue-700">
          <div className="px-4 py-3 bg-blue-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-blue-200 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
