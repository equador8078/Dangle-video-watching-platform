import "../index.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import userIcon from '../assets/userIcon.png'
import Sidebar from "./sidebar";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { User } from 'lucide-react';
import ChooseAvatar from "./ChooseAvatar";
import { useAIPanel } from "../context/PanelContext";

const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isImgUploadOpen, setImageUploadOpen] = useState(false);
    const { togglePanel, isAIPanelOpen } = useAIPanel();

    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen &&
                !dropdownRef.current?.contains(event.target) &&
                !profileButtonRef.current?.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        setDropdownOpen(isImgUploadOpen);
    }, [isImgUploadOpen]);

    const handleUserLogout = async () => {
        try {
            await logout();
            navigate("/videos/home");
            setDropdownOpen(false);
        } catch (error) {
            console.log("Logout failed: ", error);
        }
    };

    const renderUserSection = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            );
        }

        return user ? (
            <div className="relative flex items-center space-x-3">
                <button
                    type="button"
                    ref={profileButtonRef}
                    className="flex text-sm bg-gray-700 rounded-full focus:ring-4 focus:ring-gray-300 cursor-pointer"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                >
                    <img className="w-10 h-10 rounded-full" src={user?.profileImg || userIcon} alt="User" />
                </button>

                <div
                    ref={dropdownRef}
                    className={`absolute right-0  top-full mt-2 z-50 w-48 text-white
                    rounded-lg shadow-md dark:bg-gray-800 dark:divide-gray-600 transition-opacity duration-300
                    ${isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"}`}
                >

                    <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">{user.fullName}</span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                    </div>
                    <ul className="py-2">
                        <li>
                            <a onClick={() => navigate('/videos/upload')} className="block px-4 py-2 text-sm  dark:hover:bg-gray-600 cursor-pointer">Upload Video</a>
                        </li>
                        <li>
                            <a onClick={() => setImageUploadOpen(true)} className="block px-4 py-2 text-sm  dark:hover:bg-gray-600 cursor-pointer">Choose Avatar</a>
                        </li>
                        <li>
                            <a onClick={() => handleUserLogout()} className="block px-4 py-2 text-sm  dark:hover:bg-gray-600 cursor-pointer">Sign out</a>
                        </li>
                    </ul>
                </div>
            </div>
        ) : (
            <div className="space-x-10 sm:space-x-5 sm:space-y-2">
                <button className="inline-flex items-center justify-center
            gap-2 whitespace-nowrap rounded-3xl px-4 py-2
            text-l font-medium text-white transition-colors hover:bg-gray-800
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-purple-400 focus-visible:ring-offset-2
            active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => navigate('/user/login')}
                ><User size={20} />
                    <span> Log In</span>
                </button>

                <button
                    className="inline-flex items-center justify-center
                gap-2 whitespace-nowrap rounded-3xl border
                bg-white px-4 py-2 text-l font-medium text-black
                transition-colors hover:bg-gray-300
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-purple-400
                focus-visible:ring-offset-2 active:scale-95
                disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => navigate('/user/signup')}
                >
                    <User size={20} />
                    <span>Sign Up</span>
                </button>
            </div>
        );
    };

    return (
        <div className="fixed w-full z-50 h-17 flex items-center justify-between bg-slate-900 shadow-md p-4 sm:p-2">
            <div>
                <button className="top-4 left-4 sm:top-2 sm:left-2 p-2 bg-gray-200 rounded-full shadow-md" onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={24} />
                </button>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            <Link to={'/videos/home'}>
                <div className="ml-10 sm:ml-1 text-3xl font-bold text-white">Dangle</div>
            </Link>

            <div className="flex-1 flex justify-center">
                <Link to={"/videos/home"}>
                    <button onClick={togglePanel} className="w-150 sm:w-40 md:w-60 lg:w-80 xl:w-96 p-2 bg-white border rounded-md focus:outline-none focus:ring-blue-400" >Search With AI!</button>
                </Link>
            </div>

            <div className="mr-5">{renderUserSection()}</div>
            {isImgUploadOpen && (
                <ChooseAvatar setImageUploadOpen={setImageUploadOpen} />
            )}
        </div>
    );
};

export default Navbar;
