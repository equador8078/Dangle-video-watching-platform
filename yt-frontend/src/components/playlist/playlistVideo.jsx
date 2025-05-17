import { useEffect } from "react";
import { Link } from "react-router-dom";

const PlaylistVideo = ({ video ,playlistId,deletePlaylistVideo}) => {

    return (
        <div className="flex border rounded-2xl flex-row bg-gray-100 mt-2 ml-3 lg:w-180 md:w-150 sm:w-100 h-45">
    <Link to={`/videos/played/${video._id}`} className="flex w-full h-full">
        <div className="video rounded-2xl bg-slate-900 section p-3 w-2/5 h-full bg-red-300">
            <video className="rounded-2xl h-full w-full bg-black" src={video.videoURL}></video>
        </div>

        <div className="p-3 w-3/5 h-full flex flex-col justify-center">
            <div className="title text-2xl font-bold text-black w-full h-10 overflow-hidden">
                <p className="truncate">{video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}</p>
            </div>
            <div className="text-black text-sm w-full h-12 overflow-hidden">
                <p className="truncate">{video.description.length > 100 ? video.description.substring(0, 100) + "..." : video.description}</p>
            </div>
        </div>
    </Link>

    <div className="text-black text-xl">
        <div className="px-2 py-1 hover:bg-red-500 hover:text-white rounded-sm mr-1 mt-1 cursor-pointer"
            onClick={() => deletePlaylistVideo(playlistId, video._id)}>
            X
        </div>
    </div>
</div>

    );
};

export default PlaylistVideo;
