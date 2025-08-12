import { FaHome, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"} flex flex-col`}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-4 focus:outline-none">
                {isOpen ? "<<" : ">>"}
            </button>
            <nav className="flex flex-col gap-4 p-4">
                <Link to="/admin/dashboard" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
                    <FaHome /> {isOpen && "Dashboard"}
                </Link>
                <Link to="/admin/users" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
                    <FaUsers /> {isOpen && "Users"}
                </Link>
                <Link to="/admin/settings" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
                    <FaCog /> {isOpen && "Settings"}
                </Link>
                <Link to="/logout" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded mt-auto">
                    <FaSignOutAlt /> {isOpen && "Logout"}
                </Link>
            </nav>
        </div>
    );
}

export default Sidebar;
