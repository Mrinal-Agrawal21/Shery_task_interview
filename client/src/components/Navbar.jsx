import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        localStorage.removeItem('token');
        queryClient.clear();
        navigate('/login');
    };

    if (!user) return null;

    const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
            {/* Avatar Dropdown Container - we re-enable pointer events just for the interactive parts */}
            <div className="relative pointer-events-auto">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {initials}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-12 left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 border border-gray-100 animate-fadeIn">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
