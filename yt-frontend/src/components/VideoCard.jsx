import { Link } from "react-router-dom";
import ActionMenu from "./actionMenu";
import { Eye, Edit, Trash2, Archive } from "lucide-react";

const VideoCard = ({ video,isCreator,setRefresh }) => {
    return (
        <div className="relative w-[350px] sm:w-[360px] md:w-[300px] lg:w-[350px] xl:w-[400px] transition-transform duration-200 hover:-translate-y-2 mt-4 ">
        <div className="cursor-pointer xl:h-100 bg-slate-900 text-white hover:bg-black overflow-hidden rounded-4xl shadow-xl relative">
        
        {/* Video Thumbnail & Details inside Link */}
        <Link to={`/videos/played/${video._id}`} className="block">
            <div className="p-2 sm:p-4 md:p-6 flex h-[200px] sm:h-[200px] md:h-[200px] lg:h-[250px] flex-col justify-between overflow-hidden">
                <video
                    src={video.videoURL}
                    className="h-full w-full rounded-3xl hover:border-3 border-white object-cover"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                    }}
                    muted
                />
            </div>

            <div className="px-4 py-1 sm:px-6 sm:py-2">
                {/* Title & Views */}
                <div className="flex justify-between items-center">
                    <h5 className="mb-2 text-lg sm:text-xl font-bold truncate">
                        {video.title}
                    </h5>
                </div>

                <div className="flex-1 mb-4 overflow-hidden">
                    <p className="text-sm sm:text-base font-bold">
                        {video.owner.fullName || "No description available."}
                    </p>
                    <p className="text-xs sm:text-sm">
                        {new Date(video.uploadDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="flex items-center space-x-1">
                        <Eye size={20} />
                        <span>{video.views} views</span>
                    </p>
                </div>
            </div>
        </Link>
    </div>

    {/* Floating Action Menu */}
    <div className="absolute top-8 right-8 z-10 text-black">
        <ActionMenu video={video} isCreator={isCreator} setRefresh={setRefresh}/>
    </div>
</div>

    );
};

export default VideoCard;
