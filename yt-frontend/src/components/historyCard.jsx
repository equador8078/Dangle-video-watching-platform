import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HistoryCard = ({ video, deleteHistory }) => {
    return (
        <div
            className="bg-slate-900 transition-transform duration-300
            hover:-translate-y-2 hover:-translate-x-2
            hover:scale-105 text-white rounded-3xl shadow-lg overflow-hidden
            flex flex-col md:flex-row w-full relative">
            
            <Link to={`/videos/played/${video._id}`} className="flex w-full">
                <div className="w-full md:w-1/2 p-3">
                    <video
                        src={video.videoURL}
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                            e.target.pause();
                            e.target.currentTime = 0;
                        }}
                        muted
                        className="rounded-3xl w-full h-60 bg-black"
                    />
                </div>

                <div className="p-6 flex flex-col justify-start w-full mr-8 md:w-1/2">
                    <div className="text-xl md:text-2xl font-bold mb-2">
                        <h3>{video.title}</h3>
                    </div>
                    <div>
                        <p>{video.owner.fullName}</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-300 line-clamp-3 overflow-hidden text-ellipsis">
                        {video.description}
                    </div>
                </div>
            </Link>

            {/* "X" Button (Placed Outside Link) */}
            <button
                onClick={() => deleteHistory(video._id)} // Call delete function
                className="absolute top-5 right-5 text-xl hover:bg-red-700 rounded-md px-2.5 py-1 text-white">
                X
            </button>
        </div>
    );
};

export default HistoryCard;
