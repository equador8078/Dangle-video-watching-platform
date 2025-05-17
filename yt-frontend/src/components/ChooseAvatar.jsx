import axios from "axios";
import avatars from '../assets/ExportAll';
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ChooseAvatar = ({ setImageUploadOpen }) => {
    const { user, setUser } = useAuth();

    const handleUploadProfileImage = async (url) => {
        try {
            const response=await axios.post(
                "https://dangle-video-watching-platform-2.onrender.com/user/uploadProfileImage",
                { avatarURL: url },
                { withCredentials: true }
            );

            setUser((prevUser) => ({
                ...prevUser,
                profileImg: url,
            }));

            
            setImageUploadOpen(false);

        } catch (error) {
            console.log("Error uploading avatar:", error);
        }
    };

    return (
        <div className="fixed inset-0 h-screen w-screen bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative flex flex-col bg-slate-900 p-8 rounded-lg shadow-lg w-96">
                <button
                    className="absolute hover:bg-red-500 p-1 rounded-md top-2 right-2 text-white text-xl font-bold hover:text-gray-300"
                    onClick={() => setImageUploadOpen(false)}
                >
                    ✕
                </button>
                <h1 className="text-white text-2xl font-bold text-center mb-4">Choose your avatar!</h1>
                <div className="grid grid-cols-3 gap-4">
                    {Object.entries(avatars).map(([key, src]) => (
                        <img
                            key={key}
                            src={src}
                            alt={key}
                            className="rounded-full h-16 w-16 cursor-pointer hover:opacity-80"
                            onClick={() => handleUploadProfileImage(src)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChooseAvatar;