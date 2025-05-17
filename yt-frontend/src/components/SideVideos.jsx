import { Link } from "react-router-dom";

const SideVideo = ({ video }) => {
    return (
        <Link
            to={`/videos/played/${video._id}`}
            className="bg-slate-900 text-white rounded-2xl overflow-hidden w-full h-auto flex flex-col md:flex-row hover:bg-slate-800 transition"
        >
            {/* Video Section */}
            <div className="w-full md:w-1/2 p-2">
                <video
                    src={video.videoURL}
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                    }}
                    muted
                    className="rounded-2xl w-full h-40 object-cover bg-black pointer-events-none"
                />
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 px-3 py-2 flex flex-col justify-start">
                <h3 className="text-sm md:text-base font-semibold mb-1 line-clamp-1">{video.title}</h3>
                <p className="text-xs text-gray-300">{video.owner?.fullName}</p>
                <div className="mt-2 text-xs text-gray-400 line-clamp-2 overflow-hidden">
                    {video?.description}
                </div>
            </div>
        </Link>
    );
};

export default SideVideo;
